# KIDA Landing Page (Static)

Landing page tĩnh dùng cho GitHub + Vercel.

## Cấu trúc

- `index.html` — nội dung trang
- `styles.css` — giao diện
- `script.js` — render chart từ dữ liệu
- `data/performance.json` — dữ liệu hiệu quả đầu tư (cập nhật hàng tháng)

## Cập nhật chart hàng tháng

Mở file `data/performance.json` và thêm 1 dòng mới theo format:

```json
{"date":"2026-01-31","kida":590,"vnindex":190}
```

- `date`: ngày chốt số liệu (YYYY-MM-DD)
- `kida`: chỉ số hiệu quả danh mục KIDA
- `vnindex`: chỉ số VN-Index cùng kỳ

## Deploy Vercel

1. Push folder này lên GitHub repo.
2. Vào Vercel > Add New Project > Import Git Repository.
3. Framework preset: **Other** (static site).
4. Build command: để trống.
5. Output directory: để trống (root).
6. Deploy.

## Chạy local

Chạy server tĩnh bất kỳ (ví dụ):

```bash
cd kida-landing
python3 -m http.server 8080
```

Mở `http://localhost:8080`.
