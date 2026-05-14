# 🚀 Panduan Deployment GudangPro ke VPS (Ubuntu/Nginx/Docker)

Berikut adalah panduan lengkap untuk melakukan *deployment* aplikasi GudangPro Anda ke server VPS beserta integrasi Domain dan HTTPS (SSL Let's Encrypt). Sistem akan otomatis membuat dan mengindeks database MySQL menggunakan fitur *auto-seed* yang sudah disertakan.

## 📌 Prasyarat
1. Server VPS dengan OS **Ubuntu 20.04 / 22.04 LTS**
2. Akses Terminal/SSH ke dalam VPS
3. Domain atau Sub-domain aktif yang diarahkan (A record DNS) ke IP VPS Anda.

---

## 🛠️ Langkah 1: Persiapan Server & Instalasi Docker

Masuk ke VPS Anda via SSH:
```bash
ssh root@IP_VPS_ANDA
```

Update sistem dan install Docker beserta Docker Compose:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo systemctl start docker
```

---

## 🛠️ Langkah 2: Memasukkan Kode ke VPS

Anda bisa menggunakan Git (clone repositori) atau menggunakan SFTP/SCP.
Misalkan kita taruh di folder `/var/www/gudangpro`:

```bash
mkdir -p /var/www/gudangpro
cd /var/www/gudangpro
```
*Pastikan semua file project (termasuk `package.json`, `Dockerfile`, `docker-compose.yml`, dll) diletakkan di direktori ini.*

---

## 🛠️ Langkah 3: Konfigurasi Environment Variables (.env)

Buat file `.env` di direktori project tersebut:
```bash
nano .env
```
Isi dengan konfigurasi berikut (Ganti nilainya sesuai dengan keamanan Anda yang sebenarnya):
```env
# Database Credentials
DB_HOST=db
DB_USER=gudang_admin
DB_PASSWORD=PasswordKuatSuperRahasia123!
DB_NAME=gudangpro_db

# Security
JWT_SECRET=KunciRahasiaTokenAndaUntukAuthenticationYangPanjang
NODE_ENV=production
```
Simpan file tersebut (Ctrl+O, Enter, Ctrl+X).

> **Catatan Database**: Anda tidak perlu membuat tabel database secara manual. Script `seed.ts` di dalam project sudah saya perbarui dengan struktur tabel lengkap dan indexing yang dioptimasi. Ketika Docker pertama kali hidup, ia akan otomatis membuat semua tabel, relasi (Foreign Keys), indeks, serta User Admin default.

---

## 🛠️ Langkah 4: Menjalankan Aplikasi (Docker Compose)

Di dalam direktori project, jalankan build dan up di background:

```bash
sudo docker-compose up --build -d
```
Tunggu beberapa menit hingga proses pulling image MySQL dan proses build Node.js selesai.
Untuk mengecek apakah server telah running:
```bash
sudo docker-compose ps
```
Cek log-nya untuk memastikan database berhasil terbuat *(tunggu muncul pesan "Data seeding completed successfully")*:
```bash
sudo docker-compose logs -f app
```

Aplikasi saat ini telah menyala di `http://IP_VPS:3000`.

---

## 🛠️ Langkah 5: Setup Nginx sebagai Reverse Proxy & Domain

Install Nginx:
```bash
sudo apt install nginx -y
```

Buat block server Nginx baru:
```bash
sudo nano /etc/nginx/sites-available/gudangpro
```
Isi dengan konfigurasi berikut *(Ganti `gudang.domainanda.com` dengan domain asli Anda)*:
```nginx
server {
    listen 80;
    server_name gudang.domainanda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Aktifkan konfigurasi website:
```bash
sudo ln -s /etc/nginx/sites-available/gudangpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🛠️ Langkah 6: Install SSL (HTTPS) via Let's Encrypt

Untuk mengamankan website, install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
```
Jalankan Certbot untuk mendapatkan sertifikat dan otomatis mengubah Nginx ke HTTPS:
```bash
sudo certbot --nginx -d gudang.domainanda.com
```
*(Ikuti instruksi di layar, masukkan email aktif, setujui ToS, dan pilih redirect traffic HTTP ke HTTPS)*.

---

## 🎉 Selesai!

Sistem inventori GudangPro Anda kini telah live, dapat diakses via nama domain:
**https://gudang.domainanda.com**

**Akses Akun Default Administrator:**
- **Username:** `admin`
- **Password:** `admin123`

*(Sangat disarankan segera mengganti password default melalui menu Settings -> Profil Saya di dalam aplikasi setelah berhasil login).*
