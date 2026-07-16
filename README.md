# Squad 1 Dashboard

Squad 1 müşteri verilerini Google Apps Script API üzerinden okuyup GitHub Pages üzerinde gösteren bağımsız dashboard.

## Canlı veri bağlantısı

Dashboard şu API'yi kullanır:

```text
https://script.google.com/macros/s/AKfycbw3yKzdX63qgV6QDLvUYKcpKyMN_ycHj4czA1n_Gf7usepAyI4HCkHHZ8H5wvV2VbJpKA/exec
```

## GitHub Pages'e yükleme

1. GitHub hesabınıza giriş yapın.
2. Sağ üstteki `+` simgesine basın.
3. `New repository` seçin.
4. Repository adını `squad-1` yazın.
5. `Public` seçili olsun.
6. `Create repository` butonuna basın.
7. Açılan sayfada `uploading an existing file` bağlantısına basın.
8. Bu klasörün içindeki dosyaları yükleyin. `index.html` doğrudan repository ana ekranında görünmelidir.
9. `Commit changes` butonuna basın.
10. Repository içinde `Settings` sekmesine girin.
11. Sol menüden `Pages` seçin.
12. `Source` bölümünde `Deploy from a branch` seçin.
13. Branch olarak `main`, klasör olarak `/(root)` seçin.
14. `Save` butonuna basın.
15. Birkaç dakika sonra adresiniz şu formatta açılır:

```text
https://GITHUB-KULLANICI-ADINIZ.github.io/squad-1/
```

## Yerelde açma

Dosyaya çift tıklamak yerine küçük bir yerel sunucu kullanın:

```bat
cd /d "C:\Users\AtakanYanıkömer\Desktop\squad-1-dashboard"
py -m http.server 8080
```

Sonra tarayıcıda açın:

```text
http://localhost:8080
```

## Yetkili modu

Varsayılan PIN:

```text
1907
```

Bu PIN yalnızca arayüzdeki bazı alanları gizler. API adresi herkese açıksa teknik olarak gerçek bir güvenlik katmanı değildir.

## Dosyalar

- `index.html`: Dashboardun tamamı.
- `.nojekyll`: GitHub Pages'in dosyaları değiştirmeden yayınlaması için.
- `apps-script/Code.gs`: Kullanılan Apps Script kodunun yedeği.
- `YUKLEME_ADIMLARI.txt`: Basit Türkçe kurulum rehberi.
