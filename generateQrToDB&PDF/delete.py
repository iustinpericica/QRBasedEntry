import os
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="",
  database="QR"
)

for x in range(100):
    os.remove("myqr{0}.svg".format(x))
    mycursor = mydb.cursor()

    sql = "DELETE FROM codes"

    mycursor.execute(sql)

    mydb.commit()

    print(mycursor.rowcount, "record(s) deleted")
