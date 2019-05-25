import mysql.connector
import random
import string
import pyqrcode 
from pyqrcode import QRCode 

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="",
  database="QR"
)

array = []

def randomString(stringLength=30):
    #Generate a random string of fixed length
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))




for x in range(100):
  sir = randomString()
  if not (sir in array):
    array.append(sir) 
    url = pyqrcode.create(sir) 
    url.svg("myqr{0}.svg".format(x), scale = 8) 
    mycursor = mydb.cursor()
    sql = "INSERT INTO codes (code, status) VALUES (%s, %s)"
    val = (sir, 0)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, "record inserted.")
    

