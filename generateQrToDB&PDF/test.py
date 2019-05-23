import pyqrcode 
from pyqrcode import QRCode 
import img2pdf
import os

# String which represent the QR code 
s = "www.geeksforgeeks.org"
  
# Generate QR code 
url = pyqrcode.create(s) 
  
# Create and save the png file naming "myqr.png" 
url.svg("myqr.svg", scale = 8)

with open("output.pdf", "wb") as f:
    f.write(img2pdf.convert([i for i in os.listdir('E:\ionic projects\AppForQRAccesEntry\generateQrToDB&PDF') if i.endswith(".svg")]))