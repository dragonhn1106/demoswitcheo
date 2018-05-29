$(document).ready(function($) {
  $(".clickable-row").click(function() {
        window.location = $(this).data("href");
  });
  $( "#nav-menu" ).click(function() {
    $( "header nav" ).toggleClass('active');
    $(this).toggleClass('active');
  });
  $( "header nav ul li a" ).click(function() {
    $( "header nav" ).toggleClass('active');
    $(this).toggleClass('active');
  });
  $( ".faq-item-wrap" ).click(function() {
    $( ".faq-item-wrap" ).removeClass('active');
    $(this).addClass('active');
  });
  $( ".agree" ).click(function() {
    $( ".overlay" ).removeClass("overlay");
    localStorage.setItem("legal", "agreed");
  });
  if(localStorage.legal == "agreed"){
    $( ".overlay" ).removeClass("overlay");
  }
  $( "#rewards-check").submit(function(e) {
    e.preventDefault();

    $('.rewards-result, .rewards-details').addClass('hidden')
    $('.loading-wrap').addClass('loading')
    $("#rewards-check-btn").val('Checking...')

    const emailHash = md5($('#rewards-check-email').val().toLowerCase());
    $.getJSON('https://krzdvb1ax6.execute-api.ap-southeast-1.amazonaws.com/prod/getMailchimpReferrals?q=' + emailHash)
    .done(function(r) {

      const referrals = parseInt(r.message.referrals)
      const { waiting, whitelist, tier } = r.message

      $('#referral-count').text(referrals)
      $('#tokens-reward').text(referrals * 200)
      $('#whitelist-instructions').html((waiting || tier < 0) ? 'You are not on the whitelist.' : ('You are in <strong>Tier ' + tier + '</strong>.'))
      $('.rewards-result.success').removeClass('hidden')
      if (referrals > 0) $('.rewards-details').removeClass('hidden')
    }).fail(function(err) {
      $('.rewards-result.error').removeClass('hidden').text(err.responseJSON.message)
    }).always(function() {
      $('.loading-wrap').removeClass('loading')
      $("#rewards-check-btn").val('Check')
    })
  });

  // Generate new referral code
  $('input[name="REFCODE"]').val(generateReferralCode());

  // Sets incoming referral
  let searchParams = new URLSearchParams(window.location.search)
  if(searchParams.has('r')){
    let param = searchParams.get('r');
    $('input[name="INCREF"]').val(param);
  }

  // Update countdown
  if ($('.timer-values').length > 0) {
    window.countdown = setInterval(updateCountdown, 1000)
    updateCountdown()
  }

  // Update exchange rate
  if ($('#neo-rate, #gas-rate').length > 0) {
    setInterval(updateExchangeRate, 60000)
    updateExchangeRate()
  }
  $( ".switcheo-loader-wrap" ).addClass('bye');
});

function generateReferralCode() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function updateExchangeRate() {
  // $.getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=NEO,GAS&tsyms=USD', function(rate) {
  //   const per = 0.016
  //   const neo_per_swh = Math.round(rate.NEO.USD / per)
  //   const gas_per_swh = Math.round(rate.GAS.USD / per)
  //   $('#neo-rate').text(neo_per_swh.toLocaleString())
  //   $('#gas-rate').text(gas_per_swh.toLocaleString())
  // })
}

function updateCountdown() {
  // const now = new Date();
  //
  // const distance = new Date(Date.UTC(2018, 2, 16, 5)) - now;
  // const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  // const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //
  // $('.timer-values.days span:first-child').text(Math.floor(days / 10))
  // $('.timer-values.days span:nth-child(2)').text(days % 10)
  // $('.timer-values.hours span:first-child').text(Math.floor(hours / 10))
  // $('.timer-values.hours span:nth-child(2)').text(hours % 10)
  // $('.timer-values.minutes span:first-child').text(Math.floor(minutes / 10))
  // $('.timer-values.minutes span:nth-child(2)').text(minutes % 10)
  //
  // if (distance <= 0) {
  //   clearInterval(window.countdown);
  //   $('.timer').html("<strong id=ico-live>ICO IS NOW LIVE</strong>");
  // }
}