<?php
// send_mail.php
// Handler sederhana untuk form kontak di website PT. Bahtera Cipta Anugrah.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

// Fungsi sederhana untuk sanitasi input
function sanitize($field) {
    return htmlspecialchars(trim($field ?? ''), ENT_QUOTES, 'UTF-8');
}

$nama   = sanitize($_POST['nama'] ?? '');
$email  = sanitize($_POST['email'] ?? '');
$subjek = sanitize($_POST['subjek'] ?? '');
$pesan  = sanitize($_POST['pesan'] ?? '');

// GANTI email tujuan di bawah ini jika diperlukan
$to = 'pt.bahteraciptaanugrah@gmail.com';

$subject = '[Website BCA] ' . ($subjek !== '' ? $subjek : 'Pesan Baru');
$body    = "Anda menerima pesan baru dari form kontak website PT. Bahtera Cipta Anugrah:\n\n"
         . "Nama  : {$nama}\n"
         . "Email : {$email}\n"
         . "Subjek: {$subjek}\n\n"
         . "Pesan:\n{$pesan}\n";

// Header From sebaiknya pakai domain hosting Anda
$headers   = "From: noreply@bahteraciptaanugrah.com\r\n";
if (!empty($email)) {
    $headers .= "Reply-To: " . $email . "\r\n";
}

// Kirim email
$success = mail($to, $subject, $body, $headers);

// Redirect kembali ke halaman kontak dengan status
if ($success) {
    header('Location: contact.html?status=ok');
} else {
    header('Location: contact.html?status=error');
}
exit;
