document.addEventListener('DOMContentLoaded', function() {
    const googleLoginButton = document.querySelector('.google-login');
    const discordLoginButton = document.querySelector('.discord-login');
    const loginForm = document.querySelector('.email-login');

    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/auth/google'; // Sunucu tarafındaki Google yetkilendirme rotasına yönlendir
        });
    }

    if (discordLoginButton) {
        discordLoginButton.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/auth/discord'; // Sunucu tarafındaki Discord yetkilendirme rotasına yönlendir
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            if (emailInput && passwordInput) {
                const email = emailInput.value;
                const password = passwordInput.value;
                // Sunucu tarafına e-posta/şifre ile giriş isteği gönderme (fetch API örneği)
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Giriş başarılı:', data);
                    // Giriş başarılıysa kullanıcıyı ana sayfaya veya başka bir yere yönlendirin
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Giriş hatası:', error);
                    // Hata mesajını kullanıcıya gösterin
                    alert('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
                });
            }
        });
    }

    const signupLink = document.querySelector('.signup-link a');
    if (signupLink) {
        signupLink.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/register'; // Kayıt ol sayfasına yönlendir
        });
    }
});