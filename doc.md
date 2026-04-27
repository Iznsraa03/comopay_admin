# API Reference - COMOPAY

Dokumentasi ini berisi daftar endpoint API yang tersedia pada sistem backend COMOPAY.

- **Base URL**: `http://localhost:3006/api/v1`
- **Content-Type**: `application/json`

---

## Authentication

COMOPAY menggunakan **JWT (JSON Web Token)** untuk otentikasi. Token harus dikirimkan melalui header `Authorization`.

**Format Header:**
```text
Authorization: Bearer <your_jwt_token>
```

### 1. Registrasi User Baru
Membuat akun baru dan secara otomatis membuat dompet personal.
- **Endpoint**: `POST /auth/register`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "budi@example.com",
  "kata_sandi": "password123",
  "nama": "Budi Santoso",
  "nomor_telepon": "08123456789"
}
```

**Responses:**
- `201 Created`: Registrasi berhasil.
- `400 Bad Request`: Input tidak valid.
- `409 Conflict`: Email sudah terdaftar.

---

### 2. Login
Autentikasi menggunakan email dan kata sandi untuk mendapatkan token JWT.
- **Endpoint**: `POST /auth/login`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "budi@example.com",
  "kata_sandi": "password123"
}
```

**Responses:**
- `200 OK`: Mengembalikan token JWT.
- `401 Unauthorized`: Kredensial salah.

---

### 3. Profil User (Me)
Mengambil informasi user dari token yang sedang aktif.
- **Endpoint**: `GET /auth/me`
- **Auth Required**: Yes (Bearer)

**Responses:**
- `200 OK`: Detail informasi user.
- `401 Unauthorized`: Token tidak valid atau expired.

---

## Dompet (Wallet)

### 1. Cek Saldo
Mengambil informasi saldo terbaru yang sudah didekripsi.
- **Endpoint**: `GET /wallet/saldo`
- **Auth Required**: Yes (Bearer)

**Responses:**
- `200 OK`: Mengembalikan object saldo.
- `500 Server Error`: Gagal mendekripsi data saldo.

---

### 2. Top-Up Saldo (Midtrans)
Membuat permintaan top-up dan mendapatkan `snap_token` untuk pembayaran.
- **Endpoint**: `POST /wallet/topup`
- **Auth Required**: Yes (Bearer)

**Request Body:**
```json
{
  "jumlah": 50000
}
```

**Responses:**
- `200 OK`: Mengembalikan `snap_token` dan `redirect_url` Midtrans.
- `400 Bad Request`: Jumlah minimal Rp10.000.

---

## Webhooks

### 1. Webhook Midtrans
Endpoint ini dipanggil otomatis oleh server Midtrans untuk memperbarui status pembayaran.
- **Endpoint**: `POST /webhooks/midtrans`
- **Auth Required**: No (Verifikasi Signature Key internal)

**Logic**: Secara otomatis menambah saldo dompet user jika transaksi berhasil.

---

## Error Handling

Semua response error mengikuti format standar:
```json
{
  "sukses": false,
  "pesan": "Keterangan error di sini"
}
```
