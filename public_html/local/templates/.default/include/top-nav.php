	<!-- Главное меню -->
	<nav class="top-nav">
		<div class="wrapperhead">
			
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
				<!-- Корзина (мобильная версия) -->
				<div class="cart">
					<?$APPLICATION->IncludeComponent("bitrix:sale.basket.basket.line", "cart", Array(
						"PATH_TO_ORDER" => "/personal/order/make123/", // Страница оформления заказа - если указать верно, малая корзина исчезнет
						"PATH_TO_BASKET" => "/personal/cart123/", // Страница корзины - если указать верно, малая корзина исчезнет
						"PATH_TO_PERSONAL" => "/personal/",	// Персональный раздел
						"SHOW_PERSONAL_LINK" => "N",	// Отображать ссылку на персональный раздел
						),
						false
					);?>
				</div>
				<!-- Кнопка Закрыть меню (мобильная версия) -->
				<div class="menu-close"><img src="/image/menu-close.png" alt="Закрыть" width="25" /></div>
			</div>
			
			<!-- Верхнее меню по микрофонам (мобильная версия) -->
			<div class="head-menu head-menu-mobile">
				<?$APPLICATION->IncludeComponent(
					"bitrix:menu", 
					"headmenu", 
					array(
						"ROOT_MENU_TYPE" => "head",
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
			
			<!-- Главное меню -->
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
			</div><!-- /.top-menu -->
		</div><!--div /.wrapper -->
	</nav>

