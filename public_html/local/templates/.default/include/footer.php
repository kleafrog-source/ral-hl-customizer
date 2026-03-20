	<!-- Футер -->

  <button id="top-button" class="top-button"><svg xmlns="http://www.w3.org/2000/svg" class="next-svg" width="90" height="90" viewBox="0 0 90 90" fill="none">
      <circle cx="45" cy="45" r="44" transform="matrix(-1 0 0 1 90 0)" fill="#e8e1db" stroke="#999289" stroke-width="2"></circle>
      <path d="M38.4466 27.0874L56.7961 45L38.4466 62.9126" stroke="#999289" stroke-width="2" stroke-linecap="square"></path>
    </svg></button>
	<footer>
		<div class="wrapper">
			<div class="footer__cols">
				<div class="footer__col">
					<?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__col1.php"), false);?>
				</div>
				 <div class="footer__col">
							 <?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__col2.php"), false);?>
				 </div>
				<div class="footer__delimiter"></div>
				
				<div class="footer__col">
					<?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__col3.php"), false);?>
				</div>
				<div class="footer__col">
					<?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__col4.php"), false);?>
				</div>
				
				<div class="footer__col">
					<?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__col5.php"), false);?>
				</div>
				<div class="footer__contacts">
					<a href="/contacts/"><b>Контакты</b></a>
					<div class="footer__txt">
						<?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__txt.php"), false);?>
					</div>
					<div class="footer__social">
						<?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__social.php"), false);?>
					</div>
				</div>
			</div>
			<div class="footer__copyright">
				<div class="footer__copyright1"><span><?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/footer__copyright.php"), false);?></span></div>
				
			</div>

		
		</div><!-- .wrapper -->

          
	</footer>
<?$APPLICATION->IncludeComponent("bitrix:main.include", "", array("AREA_FILE_SHOW" => "file", "PATH" => SITE_DIR."include/content/pixelmail.php"), false);?>