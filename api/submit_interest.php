<?php
// Load database credentials from environment variables
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'c101ut3oa_onatechdb';
$db_user = getenv('DB_USER') ?: 'c101ut3oa_onatechdb';
$db_pass = getenv('DB_PASS');

if (!$db_pass) {
  error_log('Database password not set in environment variables');
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Server configuration error']);
  exit;
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

// Support form-encoded OR JSON
$input = $_POST;
if (empty($input)) {
  $raw = file_get_contents('php://input');
  if ($raw) $input = json_decode($raw, true) ?: [];
}

try {
  $name    = trim($input['name']    ?? '');
  $email   = trim($input['email']   ?? '');
  $country = trim($input['country'] ?? '');

  if ($name === '' || $email === '' || $country === '') {
    throw new InvalidArgumentException('All fields are required');
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    throw new InvalidArgumentException('Invalid email address');
  }

  $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
  $pdo = new PDO($dsn, $db_user, $db_pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);

  // Fixed table name to match database schema
  $stmt = $pdo->prepare('SELECT 1 FROM interest_registrations WHERE email = ?');
  $stmt->execute([$email]);
  if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'This email is already registered']);
    exit;
  }

  $stmt = $pdo->prepare('INSERT INTO interest_registrations (name, email, country) VALUES (?, ?, ?)');
  $stmt->execute([$name, $email, $country]);

  echo json_encode(['success' => true, 'message' => "Thanks, we'll notify you when OnaTrack launches."]);
} catch (InvalidArgumentException $e) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database error. Please try again later.']);
  error_log('DB error: ' . $e->getMessage());
}