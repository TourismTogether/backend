# Database Migrations

## Migration: Add password column to trips table

### File: `add_password_to_trips.sql`

### Description
Thêm cột `password` (tùy chọn) vào bảng `trips` để hỗ trợ chức năng bảo vệ bằng mật khẩu khi join trip.

### Cách chạy migration

#### Option 1: Sử dụng psql command line
```bash
psql -U your_username -d your_database_name -f migrations/add_password_to_trips.sql
```

#### Option 2: Sử dụng pgAdmin hoặc database client khác
1. Mở file `migrations/add_password_to_trips.sql`
2. Copy toàn bộ nội dung
3. Chạy SQL script trong database client của bạn

#### Option 3: Sử dụng Node.js script (nếu có)
```bash
# Nếu project có script để chạy migration
npm run migrate
# hoặc
node scripts/run-migration.js migrations/add_password_to_trips.sql
```

### Kiểm tra migration đã chạy thành công

Sau khi chạy migration, kiểm tra bằng SQL:

```sql
-- Kiểm tra cột password đã được thêm vào bảng trips
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'trips' AND column_name = 'password';
```

Kết quả mong đợi:
- `column_name`: password
- `data_type`: character varying (hoặc varchar)
- `is_nullable`: YES (cho phép NULL)

### Lưu ý

- Migration này **an toàn** để chạy nhiều lần (sử dụng `IF NOT EXISTS`)
- Cột `password` là **optional** (nullable), nghĩa là:
  - Nếu trip không có password → NULL → trip là public (ai cũng có thể join)
  - Nếu trip có password → cần nhập đúng password mới join được
- Migration không ảnh hưởng đến dữ liệu hiện có (tất cả trips hiện tại sẽ có password = NULL)

### Rollback (nếu cần)

Nếu muốn xóa cột password:

```sql
ALTER TABLE trips DROP COLUMN IF EXISTS password;
```
