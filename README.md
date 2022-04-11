
# UPT-TITIP

  

Projek ini dibuat untuk memudahkan pencatatan data titip jajan asisten.

  
  

# SETUP

  

+ Jalankan perintah `npm install`

+ Buka file **koneksi.js** pada folder **data/**

+ Buat database dengan nama yang tertera pada variable **dbName**

+ Di dalam database tadi, impor file **upt_titip.sql**

+ Jalankan perintah `npm run dev` untuk menjalankan server

  

# CHANGELOG

  

# v.1.1.0 | What's new ?

  

+ # 🔒 Dynamic Session
	+ `sessionID` yang otomatis berubah tiap jam
	+ Sesi lama yang otomatis tertutup jika telah ada sesi baru yang dibuat
	+ Sesi dapat ditutup oleh pengguna
	+ Sesi lama dapat dibuka kembali 
