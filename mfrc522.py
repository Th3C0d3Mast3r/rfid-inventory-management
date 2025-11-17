# mfrc522.py - MicroPython driver for MFRC522 (ESP32)
from machine import Pin
import time

class MFRC522:
    OK=0
    NOTAGERR=1
    ERR=2

    REQIDL=0x26
    REQALL=0x52

    def __init__(self,spi,cs):
        self.spi=spi
        self.cs=cs
        self.cs.init(Pin.OUT, value=1)
        self.reset()
        self._wreg(0x2A,0x8D)
        self._wreg(0x2B,0x3E)
        self._wreg(0x2D,30)
        self._wreg(0x2C,0)
        self._wreg(0x15,0x40)
        self._wreg(0x11,0x3D)
        self.antenna_on()

    def _wreg(self,reg,val):
        self.cs.value(0)
        self.spi.write(bytearray([((reg<<1)&0x7E),val&0xFF]))
        self.cs.value(1)

    def _rreg(self,reg):
        self.cs.value(0)
        self.spi.write(bytearray([(((reg<<1)&0x7E)|0x80)]))
        r=self.spi.read(1)
        self.cs.value(1)
        return r[0]

    def _setbit(self,reg,mask):
        self._wreg(reg,self._rreg(reg)|mask)

    def _clrbit(self,reg,mask):
        self._wreg(reg,self._rreg(reg)&(~mask))

    def reset(self):
        self._wreg(0x01,0x0F)

    def antenna_on(self):
        if (self._rreg(0x14)&0x03)!=0x03:
            self._setbit(0x14,0x03)

    def _tocard(self,cmd,send):
        recv=[]
        bits=0
        irq_en=0
        wait_irq=0
        if cmd==0x0E:
            irq_en=0x12
            wait_irq=0x10
        if cmd==0x0C:
            irq_en=0x77
            wait_irq=0x30
        self._wreg(0x02,irq_en|0x80)
        self._clrbit(0x04,0x80)
        self._setbit(0x0A,0x80)
        self._wreg(0x01,0x00)
        for c in send:
            self._wreg(0x09,c)
        self._wreg(0x01,cmd)
        if cmd==0x0C:
            self._setbit(0x0D,0x80)
        i=2000
        while True:
            n=self._rreg(0x04)
            i-=1
            if not((i!=0) and not(n&0x01) and not(n&wait_irq)):
                break
        self._clrbit(0x0D,0x80)
        if i!=0:
            if (self._rreg(0x06)&0x1B)==0x00:
                if n & irq_en & 0x01:
                    return self.NOTAGERR,[],0
                if cmd==0x0C:
                    n=self._rreg(0x0A)
                    lbits=self._rreg(0x0C)&0x07
                    if lbits!=0:
                        bits=(n-1)*8+lbits
                    else:
                        bits=n*8
                    if n==0:
                        n=1
                    if n>16:
                        n=16
                    for _ in range(n):
                        recv.append(self._rreg(0x09))
                return self.OK,recv,bits
            else:
                return self.ERR,[],0
        return self.ERR,[],0

    def request(self,mode):
        self._wreg(0x0D,0x07)
        stat,recv,bits=self._tocard(0x0C,[mode])
        if stat!=self.OK or bits!=0x10:
            return self.ERR,0
        return self.OK,bits

    def anticoll(self):
        self._wreg(0x0D,0x00)
        stat,recv,bits=self._tocard(0x0C,[0x93,0x20])
        if stat==self.OK:
            if len(recv)==5:
                chk=0
                for i in range(4):
                    chk^=recv[i]
                if chk!=recv[4]:
                    return self.ERR,None
                return self.OK,recv
        return self.ERR,None

