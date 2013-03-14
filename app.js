$(function() {

	var apibase = '/core/api.php';

	function api(params) {
		return $.ajax({
			url: apibase,
			data: params,
			type: 'POST'
		}).done(function(data) {
			var rep = data;
			if (typeof data == 'object') {
				rep = JSON.stringify(data);
			} else if (typeof data == 'string') {
				rep = data;
			}
			$('#result').text(rep);
		});
	}
	
	$('#createaccount').submit(function(event) {
		event.preventDefault();
		api({
			format: 'json',
			action: 'createaccount',
			name: $('#username').val(),
			password: $('#password').val(),
			token: $('#token').val(),
			captchaid: $('#captchaid').val(),
			captchaword: $('#captchaword').val(),
		}).done(function(data) {
			if ($('#token').val() == '' && data.createaccount.token) {
				$('#token').val(data.createaccount.token);
			}
			if (data.createaccount.captcha) {
				$('#captchaid').val(data.createaccount.captcha.id);
				$('#captchaword').val('');
				var captchaType = data.createaccount.captcha.mime;
				if (captchaType.match(/^text\//)) {
					$('#captcha').text(data.createaccount.captcha.question);
				} else if (captchaType.match(/^image\//)) {
					var $img = $('<img>').attr('src', data.createaccount.captcha.url);
					$('#captcha').empty().append($img);
				} else {
					$('#captcha').text('unknown captcha type: ' + captchaType);
				}
			}
		});
	});

});
