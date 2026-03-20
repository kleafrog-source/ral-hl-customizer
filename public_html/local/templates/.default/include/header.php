	<!-- Шапка -->
<header>
		<div class="wrapper">
			<!-- Лого -->
			<div class="logo">
                <a href="/"><div class="logotype-soyuz"></div>

                </a>
            </div>
            <div class="burger burger2">
                <div></div>
            </div>
				<div class="login-cart-block"><!-- ПК login и Корзина -->
					<!-- Вход -->
					<div class="login">				
						<?$APPLICATION->IncludeComponent("bitrix:system.auth.form", "header_login", Array(
							"REGISTER_URL" => SITE_DIR."login/",	// Страница регистрации
							"FORGOT_PASSWORD_URL" => "",	// Страница забытого пароля
							"PROFILE_URL" => SITE_DIR."personal/profile/",	// Страница профиля
							"SHOW_ERRORS" => "N",	// Показывать ошибки
							),
							false
						);?>
					</div>
			
					<!-- Корзина -->
					<div class="cart">
						<?$APPLICATION->IncludeComponent("bitrix:sale.basket.basket.line", "cart", Array(
							"PATH_TO_ORDER" => "/personal/order/make/", // Страница оформления заказа - если указать верно, малая корзина исчезнет
							"PATH_TO_BASKET" => "/personal/cart/", // Страница корзины - если указать верно, малая корзина исчезнет
							"PATH_TO_PERSONAL" => "/personal/",	// Персональный раздел
							"SHOW_PERSONAL_LINK" => "N",	// Отображать ссылку на персональный раздел
							),
							false
						);?>
					</div>
				</div>
		    <nav class="top-nav">
		<!-- <div class="wrapperhead"> -->
			
			<!-- Вход и корзина для мобильных -->
			<div class="login-cart-mobile">
				<!-- Вход (мобильная версия)  -->
				<div class="login">
					<?$APPLICATION->IncludeComponent("bitrix:system.auth.form", "mobile_login", Array(
						"REGISTER_URL" => SITE_DIR."login123/",	// Страница регистрации
						"FORGOT_PASSWORD_URL" => "",	// Страница забытого пароля
						"PROFILE_URL" => SITE_DIR."personal/profile/",	// Страница профиля
						"SHOW_ERRORS" => "N",	// Показывать ошибки
						),
						false
					);?>
				</div>
			</div>

			<div class="top-menu">
				<?$APPLICATION->IncludeComponent(
					"bitrix:menu", 
					"topmenu", 
					array(
						"ROOT_MENU_TYPE" => "top",
						"MENU_CACHE_TYPE" => "A",
						"MENU_CACHE_TIME" => "3600",
						"MENU_CACHE_USE_GROUPS" => "N",
						"MENU_CACHE_GET_VARS" => array(),
						"MAX_LEVEL" => "1",
						"CHILD_MENU_TYPE" => "",
						"USE_EXT" => "N",
						"ALLOW_MULTI_SELECT" => "N",
						"DELAY" => "N"
					),
					false
				);?>

			</div>
		</nav>
        </div>
</header>
<div class="ghosthead"></div>
