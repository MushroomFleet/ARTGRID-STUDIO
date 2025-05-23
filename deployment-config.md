# Apache2 Deployment Configuration for ARTGRID-STUDIO

**Subfolder:** `/artgrid-studio`  
**Generated:** 5/23/2025, 4:36 PM  
**Build Status:** ✅ Ready for deployment

---

## 📁 Deployment Files

### Required Upload Structure
```
/your-webroot/artgrid-studio/
├── index.html
├── static/
│   ├── css/
│   │   ├── main.810beee9.css
│   │   └── main.810beee9.css.map
│   └── js/
│       ├── main.c7a485b6.js
│       ├── main.c7a485b6.js.LICENSE.txt
│       └── main.c7a485b6.js.map
├── asset-manifest.json
└── .htaccess (create this file)
```

---

## 🔧 Apache2 Configuration

### Option 1: .htaccess File (Recommended)
**Create:** `/your-webroot/artgrid-studio/.htaccess`

```apache
# ARTGRID-STUDIO Apache2 Configuration
# Single Page Application (React Router) Support

Options -MultiViews
RewriteEngine On

# Set base path for subfolder deployment
RewriteBase /artgrid-studio/

# Handle React Router routes
# Allow existing files and directories to be served directly
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirect all other requests to index.html
RewriteRule ^ index.html [QSA,L]

# Security headers
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header always append X-Frame-Options SAMEORIGIN
    
    # XSS protection
    Header set X-XSS-Protection "1; mode=block"
    
    # Content type sniffing protection
    Header set X-Content-Type-Options nosniff
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    
    # CSS and JS files
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    
    # Images
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    
    # HTML files
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### Option 2: Virtual Host Configuration
**Add to your main Apache2 configuration or virtual host:**

```apache
<Directory "/path/to/your/webroot/artgrid-studio">
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
    
    # Enable rewrite engine
    RewriteEngine On
    RewriteBase /artgrid-studio/
    
    # Handle React Router - serve index.html for non-file requests
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [QSA,L]
    
    # Security and performance headers
    <IfModule mod_headers.c>
        Header always append X-Frame-Options SAMEORIGIN
        Header set X-XSS-Protection "1; mode=block"
        Header set X-Content-Type-Options nosniff
    </IfModule>
</Directory>

# Optional: Alias for easier management
Alias /artgrid-studio "/path/to/your/webroot/artgrid-studio"
```

---

## 🚀 Deployment Steps

### Step 1: Upload Files
1. Copy all contents of `build/` folder to `/artgrid-studio/` directory on your server
2. Ensure proper file permissions:
   ```bash
   chmod 644 /path/to/webroot/artgrid-studio/*
   chmod 644 /path/to/webroot/artgrid-studio/static/css/*
   chmod 644 /path/to/webroot/artgrid-studio/static/js/*
   chmod 755 /path/to/webroot/artgrid-studio/
   chmod 755 /path/to/webroot/artgrid-studio/static/
   chmod 755 /path/to/webroot/artgrid-studio/static/css/
   chmod 755 /path/to/webroot/artgrid-studio/static/js/
   ```

### Step 2: Create .htaccess File
1. Create `.htaccess` file in the `/artgrid-studio/` directory
2. Copy the configuration from Option 1 above
3. Set file permissions: `chmod 644 .htaccess`

### Step 3: Verify Apache2 Modules
Ensure these modules are enabled:
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate
sudo systemctl restart apache2
```

### Step 4: Test Deployment
1. Visit: `https://yoursite.com/artgrid-studio/`
2. Test navigation: `/artgrid-studio/generator`, `/artgrid-studio/about`
3. Test direct URL access (refresh page on any route)
4. Verify SVG generation and download functionality

---

## ✅ Testing Checklist

### Functionality Tests
- [ ] Homepage loads correctly (`/artgrid-studio/`)
- [ ] Navigation between pages works
- [ ] Direct URL access works (e.g., `/artgrid-studio/generator`)
- [ ] Browser back/forward buttons work
- [ ] Page refresh doesn't break routing
- [ ] Artistic Grid Generator functions
- [ ] Maze-Style Generator functions
- [ ] SVG export/download works
- [ ] Responsive design on mobile devices

### Technical Tests
- [ ] All static assets load (no 404 errors in browser console)
- [ ] JavaScript console shows no errors
- [ ] CSS styles apply correctly
- [ ] React Router history mode works
- [ ] Performance is acceptable (check browser dev tools)

### Security Tests
- [ ] Security headers are present (check browser dev tools)
- [ ] No sensitive files are accessible
- [ ] .htaccess file is working (test with invalid route)

---

## 🔍 Troubleshooting

### Common Issues

**404 Errors on Navigation:**
- Check if mod_rewrite is enabled
- Verify .htaccess file exists and has correct permissions
- Ensure RewriteBase matches your subfolder path

**Static Assets Not Loading:**
- Verify file permissions (644 for files, 755 for directories)
- Check if files were uploaded correctly
- Ensure homepage field in package.json matches deployment path

**Blank Page on Load:**
- Check browser console for JavaScript errors
- Verify index.html is accessible
- Ensure React bundle files are loading correctly

**Routes Not Working:**
- Confirm React Router configuration
- Check Apache2 rewrite rules
- Verify .htaccess syntax

---

## 📞 Support Commands

### Check Apache2 Status
```bash
sudo systemctl status apache2
sudo apache2ctl configtest
```

### View Apache2 Error Logs
```bash
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log
```

### Test .htaccess Syntax
```bash
apache2ctl -t
```

---

**Deployment Status:** ✅ Ready  
**Last Updated:** 5/23/2025, 4:36 PM  
**Next Steps:** Upload files and create .htaccess configuration
