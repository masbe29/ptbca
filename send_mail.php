<?php
// send_mail.php (SMTP Gmail via PHPMailer)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

function sanitize($field) {
    return htmlspecialchars(trim($field ?? ''), ENT_QUOTES, 'UTF-8');
}

$nama   = sanitize($_POST['nama'] ?? '');
$email  = sanitize($_POST['email'] ?? '');
$subjek = sanitize($_POST['subjek'] ?? '');
$pesan  = sanitize($_POST['pesan'] ?? '');

// VALIDASI sederhana
if ($nama === '' || $pesan === '') {
    header('Location: contact.html?status=error');
    exit;
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?status=error');
    exit;
}

// EMAIL TUJUAN (Gmail perusahaan inbox penerima)
$to = 'pt.bahteraciptaanugrah@gmail.com';

$subject = '[Website BCA] ' . ($subjek !== '' ? $subjek : 'Pesan Baru');
$body    = "Anda menerima pesan baru dari form kontak website PT. Bahtera Cipta Anugrah:\n\n"
         . "Nama  : {$nama}\n"
         . "Email : {$email}\n"
         . "Subjek: {$subjek}\n\n"
         . "Pesan:\n{$pesan}\n";

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // === KONFIG SMTP GMAIL ===
    $gmailUser = 'pt.bahteraciptaanugrah@gmail.com'; // akun pengirim (biasanya sama dengan $to)
    $gmailAppPassword = 'ISI_APP_PASSWORD_16_KARAKTER_DI_SINI';

    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $gmailUser;
    $mail->Password   = $gmailAppPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->CharSet = 'UTF-8';

    // From sebaiknya sama dengan akun SMTP (biar tidak ditolak/spoof)
    $mail->setFrom($gmailUser, 'Website PT. Bahtera Cipta Anugrah');

    // Tujuan inbox (Gmail perusahaan)
    $mail->addAddress($to);

    // Reply-To ke pengirim form (kalau user isi email)
    if (!empty($email)) {
        $mail->addReplyTo($email, $nama ?: $email);
    }

    $mail->Subject = $subject;
    $mail->Body    = $body;

    $mail->send();

    header('Location: contact.html?status=ok');
    exit;

} catch (Exception $e) {
    // Kalau mau, log error: error_log($mail->ErrorInfo);
    header('Location: contact.html?status=error');
    exit;
}
