var timeouts = [], did_show_results = !1;
var urlZip = '/zip.aspx';
var urlReg = '/reg.aspx';
var oSteps = {
	num_steps: 6,
	step_age: 3,
	step_zipcode: 4,
	step_pass: 5,
	step_email: 6
};

function init() {
	$(document).on("focus", "textarea, input, select", function () {
		$("body").addClass("fixfixed")
	}).on("blur", "textarea, input, select", function () {
		$("body").removeClass("fixfixed")
	}),
		$("[ng-model]").on("focus", function () {
			var e = $(this);
			$('[data-placeholder="' + e.attr("ng-model") + '"]').addClass("step__field__placeholder_active")
		}),
		$("[ng-model]").on("blur", function () {
			var e = $(this);
			0 === e.val().length && $('[data-placeholder="' + e.attr("ng-model") + '"]').removeClass("step__field__placeholder_active")
		}),
		$('[data-girl=""]').each(function () {
			var e = $(this);
			e.css("background-image", 'url("' + e.data("image") + '")'), e.find('[data-girl="name"]').html(e.data("name")), e.find('[data-girl="age"]').html(e.data("age")), e.find('[data-girl="distance"]').html(e.data("distance"))
		})
}
function animateStep(e, t) {
	var a = $("[data-step=" + e + "]");
	$new_step = $("[data-step=" + t + "]"),

		did_show_results && resetResults(),
		e != t && e <= oSteps.num_steps ? "zoom" == $new_step.data("effect") ? (a.css("transform", "scale(0)").fadeOut(200, function () {
			$new_step.fadeIn(200).css("transform", "scale(1)")
		}), 2 == t && timeouts.push(setTimeout(function () {
			$new_step.hide();
			var tNext = t +1;
			var $new_step2 = $("[data-step=" + tNext + "]");
			$new_step2.fadeIn(200).css("transform", "scale(1)");
			setTimeout(function(){
				$new_step2.find(".step__field__input").focus();
			}, 800);
		}, 3000 )) && timeouts.push(setTimeout(function () {
			$('.step__map__text').find('.finding').hide();
			$('.step__map__text').find('.found').show();
		}, 2000 )))  : "left" == $new_step.data("effect") ? (a.css("transform", "translateX(-100%)").fadeOut(400), $new_step.fadeIn(400).css("transform", "translateX(0)")) : "up" == $new_step.data("effect") ? $new_step.fadeIn(400).css("transform", "translateY(0)") : "turn" == $new_step.data("effect") && ($("[data-step=" + (e - 1) + "]").fadeOut(100),  a.show().css("transform", "rotate3d(0, 1, 0, -90deg)").fadeOut(250, function () {
			$new_step.fadeIn(250).css("transform", "rotate3d(0, 1, 0, 0deg)")
		})) : $new_step.fadeIn(400), $(window).scrollTop($("[data-form]").offset().top),
		setTimeout(function(){
			$new_step.find(".step__field__input").focus();
		}, 800);
}
function showResults(e) {
	e && (did_show_results = !0, document.activeElement.blur(), $('button, input[type="submit"]').prop("disabled", !0), $("[data-step]").fadeOut(400, function () {
		$("[data-results]").fadeIn(400, function () {
			timeouts.push(setTimeout(function () {
				$('[data-checks] [data-check="0"]').fadeOut(200, function () {
					$('[data-check="1"]').fadeIn(200)
				})
			}, 1250)),
				timeouts.push(setTimeout(function () {
					$('[data-checks] [data-check="1"]').fadeOut(200, function () {
						$('[data-check="2"]').fadeIn(200)
					})
				}, 2500)),
				timeouts.push(setTimeout(function () {
					$('[data-checks] [data-check="2"]').fadeOut(200, function () {
						$('[data-check="3"]').fadeIn(200),
							$("[data-spinner]").fadeOut(400),
							$("[data-finish]").fadeIn(400)
					})
				}, 3750))
		})
	}))
}
function resetResults() {
	did_show_results = !1;
	for (var e = 0; e < timeouts.length; e++) clearTimeout(timeouts[e]);
	$("[data-results]").fadeOut(400)
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function validatePass(pwd) {
	var letter = /[a-zA-Z]/;
	var number = /[0-9]/;
	var valid = number.test(pwd) && letter.test(pwd) && pwd.length >= 6 && pwd.length <= 16;
	return valid;
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {
	init();

	var cur_step = 1;
	var nextBtn = $('.btn__next');

	var showError = function(field, message) {
		field.focus().addClass("step__field__input_error");
		field.parent().find(".step__field__placeholder").addClass("step__field__placeholder_error");
		field.parent().find(".step__field__error").html(message).show();
	};
	var hideError = function(field) {
		field.removeClass("step__field__input_error");
		field.parent().find("[data-valid]").fadeIn();
		field.parent().find(".step__field__placeholder").removeClass("step__field__placeholder_error");
		field.parent().find(".step__field__error").html("").hide();
	};

	var validateFields = function () {
		var fieldAge = $("input[name=age]"),  fieldAgeVal = fieldAge.val(),
			fieldZip = $("input[name=zipcode]"), fieldZipVal = fieldZip.val(),
			fieldEmail = $("input[name=email]"), fieldEmailVal = fieldEmail.val(),
			fieldPass = $("input[name=password]"), fieldPassVal = fieldPass.val();

		if (cur_step == 2) cur_step = 3; // jump to 3rd

		var new_step = cur_step + 1;

		switch (cur_step) {
			case oSteps.step_age : // age
				if (fieldAgeVal == '' || !$.isNumeric(fieldAgeVal) || fieldAgeVal === undefined || fieldAgeVal < 18 || fieldAgeVal > 99) {
					showError(fieldAge, "Invalid age. You must be 18+");
					return false;
				} else {
					hideError(fieldAge);
					setTimeout(function(){
						animateStep(cur_step, new_step);
						cur_step++;
					}, 300);
				}
				break;
			case oSteps.step_zipcode : // zipcode
				var formData2 = {'z' : fieldZipVal };

				if (fieldZipVal == '' || !$.isNumeric(fieldZipVal) || fieldZipVal === undefined || fieldZipVal.length < 5 || fieldZipVal.length > 16) {
					showError(fieldZip, "Invalid zip code. Must have 5 digits");
					return false;
				} else {
					$.ajax({
						type: "POST",
						url: urlZip,
						data: formData2,
						beforeSend: function(){
							nextBtn.addClass('disabled');
						}
					})
						.success(function(data) {
							if (data != "ok") {
								showError(fieldZip, "Invalid zip code. Must have 5 digits");
								return false;
							} else {
								hideError(fieldZip);
								setTimeout(function(){
									animateStep(cur_step, new_step);
									cur_step++;
								}, 300);
							}

							nextBtn.removeClass('disabled');
						}).error( function (jqXHR, status, error) {
							console.log(jqXHR.responseText);
							nextBtn.removeClass('disabled');
						});
				}
				break;
			case oSteps.step_pass : // password
				if (fieldPassVal == '' || fieldPassVal === undefined || validatePass(fieldPassVal) != true) {
					showError(fieldPass, "Password must contain letters and numbers and be 6-16 characters.");
					return false;
				} else {
					hideError(fieldPass);
					setTimeout(function(){
						animateStep(cur_step, new_step);
						cur_step++;
					}, 300);
				}
				break;
			case oSteps.step_email : // email
				if (fieldEmailVal == '' || fieldEmailVal === undefined || validateEmail(fieldEmailVal) != true) {
					showError(fieldEmail, "Email is not valid.");
					return false;
				} else {
					hideError(fieldEmail);
					handleSending();

					setTimeout(function(){
						showResults(1);
					}, 300);
				}
				break;
			default : // for other steps
				animateStep(cur_step, new_step);
				cur_step++;
				break;
		}
	};

	function handleSending(){

		var c = getParameterByName('c') ? getParameterByName('c') : '';
		var aid = getParameterByName('a') ? getParameterByName('a') : '';

		var formData = {
			'a' : $('input[name=age]').val(),
			'e' : $('input[name=email]').val(),
			'z' : $('input[name=zipcode]').val(),
			'p' : $('input[name=password]').val(),
			'c' : c,
			'aid' : aid,
			'l' : 0
		};

		//console.log("formData: ", formData);

		nextBtn.addClass('disabled');

		$.ajax({
			type: "POST",
			url: urlReg,
			data: formData
		})
			.success(function(data) {
				if (data === 'msg' || data === 'sent') {
					$("#success-mail").html($('input[name=email]').val());
					$("#success-message").fadeIn();
				} else {
					$(".results__link").attr('href', data).fadeIn(); // url from server
				}

				nextBtn.removeClass('disabled');
			})
			.error( function (jqXHR, status, error) {
				console.log(jqXHR.responseText);
				nextBtn.removeClass('disabled');
			});
	}

	nextBtn.on('click', function(e){
		e.preventDefault();
		validateFields();
	});

	// Show/Hide Password
	$(".field__show").on("click", function () {
		var t = $(this), e = t.siblings(".step__field__input");
		t.hasClass("is--active") ? (t.removeClass("is--active"), e.attr("type", "password").focus()) : (t.addClass("is--active"), e.attr("type", "text").focus())
	});

});