document.addEventListener('DOMContentLoaded', function() {
    console.log('NE GOTOV - сайт загружен');
    
    // ===== ОПРЕДЕЛЯЕМ ТИП УСТРОЙСТВА =====
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // ===== ОПТИМИЗАЦИЯ ДЛЯ МОБИЛЬНЫХ =====
    if (isMobile) {
        console.log('Мобильное устройство - запускаем оптимизированную версию');
        
        // 1. УПРОЩЕННАЯ ГИРЛЯНДА для мобильных
        const garland = document.querySelector('.garland');
        if (garland) {
            const lights = garland.querySelectorAll('.light');
            lights.forEach(light => {
                // Более простая и медленная анимация для мобильных
                light.style.animation = 'blink-mobile 4s infinite alternate';
                light.style.boxShadow = '0 0 5px currentColor';
                light.style.opacity = '0.5';
            });
            
            // Добавляем CSS для мобильной анимации
            const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
    @keyframes blink-mobile {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.1); }
    }
    
    @keyframes fall-mobile {
        to {
            transform: translateY(100vh) translateX(var(--x-move, 0px));
            opacity: 0.2;
        }
    }
    
    @media (max-width: 768px) {
        /* Гирлянда */
        .garland {
            top: 15px !important;
            z-index: 1 !important;
            opacity: 0.8 !important;
        }
        
        .garland .light {
            animation: blink-mobile 5s infinite alternate !important; /* МЕДЛЕННЕЕ: 5s вместо 4s */
            box-shadow: 0 0 10px currentColor !important;
            width: 12px !important;
            height: 12px !important;
            opacity: 0.9 !important;
        }
        
        /* Позиции лампочек */
        .garland .light:nth-child(1) { top: 25px !important; }
        .garland .light:nth-child(2) { top: 10px !important; }
        .garland .light:nth-child(3) { top: 20px !important; }
        .garland .light:nth-child(4) { top: 5px !important; }
        .garland .light:nth-child(5) { top: 15px !important; }
        .garland .light:nth-child(6) { top: 0px !important; }
        .garland .light:nth-child(7) { top: 15px !important; }
        .garland .light:nth-child(8) { top: 10px !important; }
        .garland .light:nth-child(9) { top: 20px !important; }
        .garland .light:nth-child(10){ top: 12px !important; }
        
        /* Снежинки - ОЧЕНЬ МЕДЛЕННЫЕ */
        .snowflake {
            animation-duration: 80s !important;
            animation-timing-function: linear !important;
        }
    }
`;
            document.head.appendChild(mobileStyle);
        }
        
        // 2. МЕДЛЕННЫЙ СНЕГ для мобильных
        const snowContainer = document.querySelector('.snow-container');
        if (snowContainer) {
            let activeSnowflakes = 0;
            const MAX_SNOW_MOBILE = 8; // Меньше снежинок на мобильных
            let snowInterval;
            
function createMobileSnowflake() {
    if (activeSnowflakes >= MAX_SNOW_MOBILE) return;
    
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // УПРОЩЕННЫЙ размер - ВСЕ снежинки одинаковые
    const size = 5; // Фиксированный размер вместо Math.random()
    
    snowflake.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}vw;
        opacity: ${Math.random() * 0.7 + 0.3};
        background: rgba(255,255,255,0.9);
        border-radius: 50%;
        position: absolute;
        top: -10px;
        pointer-events: none;
        box-shadow: 0 0 4px rgba(255,255,255,0.8); /* Упрощенная тень */
        z-index: 99;
        will-change: transform;
        backface-visibility: hidden;
    `;
    
    // УПРОЩЕННАЯ анимация через CSS класс
    snowflake.style.animation = `fall ${15 + Math.random() * 10}s linear infinite`;
    
    snowContainer.appendChild(snowflake);
    activeSnowflakes++;
    
    // Удаляем через нормальное время
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.remove();
            activeSnowflakes--;
        }
    }, 25000); // 25 секунд
}
            
            // Создаем снег реже на мобильных
            snowInterval = setInterval(createMobileSnowflake,  600);
            
            // Создать начальные снежинки
            setTimeout(() => {
                for (let i = 0; i < 3; i++) { // Было 5, стало 3
                    setTimeout(createMobileSnowflake, i * 150);
                }
            }, 300);
            
            // Остановить снег при скрытии страницы (экономия батареи)
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    clearInterval(snowInterval);
                    // Удаляем все снежинки
                    document.querySelectorAll('.snowflake').forEach(snow => snow.remove());
                    activeSnowflakes = 0;
                } else {
                    snowInterval = setInterval(createMobileSnowflake, 300);
                }
            });
            
            // Пауза снега при скролле для производительности
            let scrollTimeout;
            window.addEventListener('scroll', function() {
                // На время скролла останавливаем создание снега
                clearInterval(snowInterval);
                clearTimeout(scrollTimeout);
                
                // Возобновляем через 500ms после остановки скролла
                scrollTimeout = setTimeout(() => {
                    snowInterval = setInterval(createMobileSnowflake, 300);
                }, 500);
            });
        }
        
        // 3. ОТКЛЮЧАЕМ СЛОЖНЫЕ АНИМАЦИИ на мобильных для производительности
        const disableComplexAnimations = () => {
            const elements = document.querySelectorAll('.feature-card, .menu-item, .contact-item, .delivery-item');
            elements.forEach(el => {
                el.style.transition = 'opacity 0.3s, transform 0.3s';
                el.style.willChange = 'auto';
                // Отключаем hover-эффекты на тач-устройствах
                el.style.pointerEvents = 'auto';
            });
        };
        
        setTimeout(disableComplexAnimations, 1000);
        
    } else {
        // ===== ПОЛНАЯ ВЕРСИЯ ДЛЯ ДЕСКТОП =====
        console.log('Десктоп устройство - запускаем полную версию');
        
        // 1. ПОЛНЫЙ СНЕГ для десктоп
        const snowContainer = document.querySelector('.snow-container');
        if (snowContainer) {
            let snowInterval;
            let activeSnowflakes = 0;
            const MAX_SNOW_DESKTOP = 25;
            
            function createDesktopSnowflake() {
                if (activeSnowflakes >= MAX_SNOW_DESKTOP) return;
                
                const snowflake = document.createElement('div');
                snowflake.classList.add('snowflake');

                // Полные параметры для десктоп
                const size = Math.random() * 6 + 4;
                const duration = Math.random() * 15 + 10;
                
                snowflake.style.width = `${size}px`;
                snowflake.style.height = `${size}px`;
                snowflake.style.left = `${Math.random() * window.innerWidth}px`;
                snowflake.style.opacity = Math.random() * 0.6 + 0.4;
                snowflake.style.setProperty('--x-move', `${Math.random() * 40 - 20}px`);
                snowflake.style.animationDuration = `${duration}s`;

                snowContainer.appendChild(snowflake);
                activeSnowflakes++;

                setTimeout(() => {
                    if (snowflake.parentNode) {
                        snowflake.remove();
                        activeSnowflakes--;
                    }
                }, duration * 1000);
            }
            
            // Чаще создаем снежинки на десктоп
            snowInterval = setInterval(createDesktopSnowflake, 150);
            
            // Начальные снежинки
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    setTimeout(createDesktopSnowflake, i * 200);
                }
            }, 300);
        }
    }
    
    // ===== ОБЩИЙ КОД ДЛЯ ВСЕХ УСТРОЙСТВ =====
    
    // Элементы мобильного меню
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Элементы модального окна
    const orderModal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const orderItemName = document.getElementById('orderItemName');
    const orderItemPrice = document.getElementById('orderItemPrice');
    
    // Открытие мобильного меню
    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                mobileMenu.style.display = 'flex';
                // Небольшая задержка для плавной анимации
                requestAnimationFrame(() => {
                    mobileMenu.classList.add('active');
                });
                document.body.style.overflow = 'hidden';
                document.body.style.touchAction = 'none'; // Блокируем скролл на iOS
            } else {
                mobileMenu.classList.remove('active');
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                    document.body.style.overflow = '';
                    document.body.style.touchAction = '';
                }, 300);
            }
        });
    }
    
    // Закрытие мобильного меню
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            if (burgerMenu) burgerMenu.classList.remove('active');
            
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
            }, 300);
        });
    }
    
    // Закрытие меню при клике на ссылку
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Если ссылка ведет на якорь, даем время на плавный скролл
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                // Закрываем меню
                mobileMenu.classList.remove('active');
                if (burgerMenu) burgerMenu.classList.remove('active');
                
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                    document.body.style.overflow = '';
                    document.body.style.touchAction = '';
                    
                    // Плавный скролл к цели
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        const targetPosition = targetElement.offsetTop - 80;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            } else {
                // Для внешних ссылок просто закрываем меню
                mobileMenu.classList.remove('active');
                if (burgerMenu) burgerMenu.classList.remove('active');
                
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                    document.body.style.overflow = '';
                    document.body.style.touchAction = '';
                }, 300);
            }
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            burgerMenu && !burgerMenu.contains(e.target)) {
            
            mobileMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
            
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
            }, 300);
        }
    });
    
    // Закрытие меню при изменении ориентации
    window.addEventListener('orientationchange', function() {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (burgerMenu) burgerMenu.classList.remove('active');
            
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
            }, 300);
        }
    });
    
    // Функции для модального окна заказа
    function openOrderModal(itemName, itemPrice) {
        if (orderItemName) orderItemName.textContent = itemName;
        if (orderItemPrice) orderItemPrice.textContent = itemPrice;
        if (orderModal) {
            orderModal.classList.add('active');
            orderModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeOrderModal() {
        if (orderModal) {
            orderModal.classList.remove('active');
            setTimeout(() => {
                orderModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    // Обработчики для модального окна
    if (modalClose) {
        modalClose.addEventListener('click', closeOrderModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeOrderModal);
    }
    
    // Закрытие модального окна при клике вне его
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === orderModal) {
                closeOrderModal();
            }
        });
    }
    
    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && orderModal && orderModal.classList.contains('active')) {
            closeOrderModal();
        }
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.feature-card, .menu-item, .step, .contact-item, .delivery-item').forEach(item => {
        if (item) {
            observer.observe(item);
        }
    });
    
    // Функция плавной прокрутки
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        const headerHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // Обработчики для навигационных ссылок (десктоп)
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });
    
    // Обработчики CTA кнопок
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Смотреть меню') {
                smoothScrollTo('menu-preview');
            }
        });
    });
    
    // Обработчики кнопок "Заказать" в меню
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            if (!menuItem) return;
            
            const itemName = menuItem.querySelector('h3')?.textContent || 'Блюдо';
            const itemPrice = menuItem.querySelector('.price')?.textContent || '0 ₽';
            
            openOrderModal(itemName, itemPrice);
            console.log(`Открыт заказ: ${itemName} - ${itemPrice}`);
        });
    });
    
    // Наблюдаем за кнопкой CTA для повторной анимации при скролле
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        observer.observe(ctaButton);
    }
    
    // Оптимизация производительности при ресайзе
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            console.log('Window resized - пересчет элементов');
            
            // Пересчитываем позиции для анимаций
            if (isMobile) {
                // На мобильных можно обновить позиции гирлянды
                const garland = document.querySelector('.garland');
                if (garland && window.innerWidth <= 768) {
                    garland.style.width = '90%';
                }
            }
        }, 250);
    });
    
    // Анимация кнопки CTA с задержкой
    setTimeout(() => {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.style.opacity = '1';
            ctaButton.style.transform = 'translateY(0)';
            ctaButton.style.transition = 'all 0.8s ease';
        }
    }, 2200);
    
    // Предотвращение быстрых кликов на мобильных
    if (isMobile) {
        let lastClickTime = 0;
        const minClickDelay = 300; // 300ms между кликами
        
        document.addEventListener('click', function(e) {
            const currentTime = Date.now();
            if (currentTime - lastClickTime < minClickDelay) {
                e.preventDefault();
                e.stopPropagation();
            }
            lastClickTime = currentTime;
        }, true);
    }
    
    // Улучшение touch-событий на мобильных
    if (isMobile) {
        // Предотвращаем масштабирование при двойном тапе
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Улучшаем отзывчивость кнопок
        document.querySelectorAll('button, a').forEach(element => {
            element.style.tapHighlightColor = 'rgba(168, 218, 220, 0.1)';
            element.style.webkitTapHighlightColor = 'rgba(168, 218, 220, 0.1)';
        });
    }
    
    console.log('Все скрипты инициализированы успешно');
});

// Fallback для старых браузеров
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 16);
    };
}

// Полифил для classList.toggle с force параметром
if (typeof Element !== 'undefined') {
    Element.prototype._toggleClass = Element.prototype.classList.toggle;
    Element.prototype.classList.toggle = function(className, force) {
        if (force !== undefined) {
            if (force) {
                this.classList.add(className);
                return true;
            } else {
                this.classList.remove(className);
                return false;
            }
        } else {
            return this._toggleClass(className);
        }
    };
}