function playMovie(){
    var movie_json = JSON.parse($('#movie-json').text());

    $('#movie-detail-header-pro').empty();
    $('#movie-detail-header-pro').append('<div id="jwplayer-movie"></div>');

    movie_json['height'] = '100%';
    
    jwplayer('jwplayer-movie').setup(movie_json);
}

function addFavorite(media_id, type_of_media){
    $.ajax({
        url: "/sv",
        data: {'type': type_of_media, 'mid': media_id},
        success: function(result){
            if(result.responseText == 'remove'){
                $('#addfav').text("Adicionar aos favoritos");
            }else{
                $('#addfav').text("Remover dos favoritos");
            }
        },
        error: function (result) {
            if(result.responseText == 'remove'){
                $('#addfav').text("Adicionar aos favoritos");
            }else{
                $('#addfav').text("Remover dos favoritos");
            }
        }
    });
}

function openEpisode(id){
    var movie_json = JSON.parse($('#episodio-' + id).text());

    $('#movie-detail-header-pro').empty();
    $('#movie-detail-header-pro').append('<div id="jwplayer-movie"></div>');

    movie_json['height'] = '100%';
    
    jwplayer('jwplayer-movie').setup(movie_json);
}

function openAnimeEpisode(id){
    var movie_json = $('#episodio-' + id).text();

    $('#movie-detail-header-pro').empty();
    $('#movie-detail-header-pro').append('<iframe width="100%" height="100%" allowfullscreen="true" src="' + movie_json + '"></iframe>');
}

function changeSeason(serie_id, temporada_n){
    $('.dropdown-item').removeClass('active');
    $('#temporada-num-' + temporada_n).addClass('active');

    var html_owl = '';
    owl = $("#owl-slider");

    $.ajax({
        url: "/ns",
        data: {'sid': serie_id, 't_n': temporada_n},
        success: function(result){
            for(var i = 0; i < result.length; i++){
                html_owl += '<div class="item" onClick="openEpisode(' + result[i]['id'] + ')">\
                                <a class="movie-detail-media-link afterglow">\
                                    <div class="movie-detail-media-image">\
                                        <img src="' + result[i]['capa'] + '">\
                                        <span><i class="fas fa-play"></i></span>\
                                        <h6>' + result[i]['nome'] + '</h6>\
                                    </div>\
                                    <div style="display: none;" id="episodio-' + result[i]['id'] + '">' + result[i]['json'] + '</div>\
                                </a>\
                            </div>'
            }

            $('#owl-slider').empty();
            $('#owl-slider').append(html_owl);

            owl.trigger('refreshed.owl.carousel');
            owl.owlCarousel({
                // autoPlay : 3000,
                pagination: false,
                paginationSpeed : 1000,
                goToFirstSpeed : 2000,
                items : 3, //10 items above 1000px browser width
                itemsDesktop : [1000,5], //5 items between 1000px and 901px
                itemsDesktopSmall : [900,3], // betweem 900px and 601px
                itemsTablet: [600,2], //2 items between 600 and 0
                itemsMobile : false, // itemsMobile disabled - inherit from itemsTablet option
                lazyLoad : true,
                autoHeight:true
            });
        }
    });
}

function update_foto(){
    // $('#photo-btn').click();
}

$('#search-input').keyup(function() {
    var search = $('#search-input').val();
    
    if(search != ""){
        $('#col-main').hide();
        $('.main-search').show();

        // get search data
        $.ajax({
            url: "/s",
            data: {'s': search},
            success: function(result){

                $('#search-results').empty();
                $('#search-results-series').empty();
                
                // mostrando dados
                $('#movie-results-amount').text(result['filmes'].length + ' RESULTADO(S) ENCONTRADO(S) PARA: FILMES');

                // filmes
                var results_html = '';
                for(var i = 0; i < result['filmes'].length; i++) {
                    results_html += '<div class="col-12 col-md-6 col-lg-4 col-xl-3">\
                                            <div class="item-listing-container-skrn">\
                                                <a href="/watch?t=1&id=' + result['filmes'][i].id + '"><img src="' + result['filmes'][i].capa + '" alt="' + result['filmes'][i].nome + '"></a>\
                                                <div class="item-listing-text-skrn">\
                                                    <div class="item-listing-text-skrn-vertical-align"><h6><a href="/watch?t=1&id=' + result['filmes'][i].id + '">' + result['filmes'][i].nome + '</a></h6>\
                                                    </div><!-- close .item-listing-text-skrn-vertical-align -->\
                                                </div><!-- close .item-listing-text-skrn -->\
                                            </div><!-- close .item-listing-container-skrn -->\
                                        </div><!-- close .col -->';
                }

                $('#search-results').append(results_html);

                // séries
                $('#movie-results-amount-series').text(result['series'].length + ' RESULTADO(S) ENCONTRADO(S) PARA: SÉRIES');

                results_html = '';
                for(var i = 0; i < result['series'].length; i++) {
                    results_html += '<div class="col-12 col-md-6 col-lg-4 col-xl-3">\
                                            <div class="item-listing-container-skrn">\
                                                <a href="/watch?t=2&id=' + result['series'][i].id + '"><img src="' + result['series'][i].capa + '" alt="' + result['series'][i].nome + '"></a>\
                                                <div class="item-listing-text-skrn">\
                                                    <div class="item-listing-text-skrn-vertical-align"><h6><a href="/watch?t=2&id=' + result['series'][i].id + '">' + result['series'][i].nome + '</a></h6>\
                                                    </div><!-- close .item-listing-text-skrn-vertical-align -->\
                                                </div><!-- close .item-listing-text-skrn -->\
                                            </div><!-- close .item-listing-container-skrn -->\
                                        </div><!-- close .col -->';
                }

                console.log(result['series'].length);
                
                $('#search-results-series').append(results_html);
            },
            error: function (result) {
                console.log('error: ', result);
            }
        });
    }else{
        $('.main-search').hide();
        $('#col-main').show();
    }
});

// Mobile javascript functions
function mobileSearch(){
    var search = $('#mobile-search-input').val();

    // esconde o menu e o col-main
    $('#mobile-bars-icon-pro').click();
    $('#col-main').hide();

    // mostra o main-search
    $('.main-search').show();

    // get search data
    $.ajax({
        url: "/s",
        data: {'s': search},
        success: function(result){

            $('#search-results').empty();
            $('#search-results-series').empty();
            
            // mostrando dados
            $('#movie-results-amount').text(result['filmes'].length + ' RESULTADO(S) PARA FILMES');

            // filmes
            var results_html = '';
            for(var i = 0; i < result['filmes'].length; i++) {
                results_html += '<div class="col-12 col-md-6 col-lg-4 col-xl-3">\
                                        <div class="item-listing-container-skrn">\
                                            <a href="/watch?t=1&id=' + result['filmes'][i].id + '"><img src="' + result['filmes'][i].capa + '" alt="' + result['filmes'][i].nome + '"></a>\
                                            <div class="item-listing-text-skrn">\
                                                <div class="item-listing-text-skrn-vertical-align"><h6><a href="/watch?t=1&id=' + result['filmes'][i].id + '">' + result['filmes'][i].nome + '</a></h6>\
                                                </div><!-- close .item-listing-text-skrn-vertical-align -->\
                                            </div><!-- close .item-listing-text-skrn -->\
                                        </div><!-- close .item-listing-container-skrn -->\
                                    </div><!-- close .col -->';
            }

            $('#search-results').append(results_html);

            // séries
            $('#movie-results-amount-series').text(result['series'].length + ' RESULTADO(S) PARA SÉRIES');

            results_html = '';
            for(var i = 0; i < result['series'].length; i++) {
                results_html += '<div class="col-12 col-md-6 col-lg-4 col-xl-3">\
                                        <div class="item-listing-container-skrn">\
                                            <a href="/watch?t=2&id=' + result['series'][i].id + '"><img src="' + result['series'][i].capa + '" alt="' + result['series'][i].nome + '"></a>\
                                            <div class="item-listing-text-skrn">\
                                                <div class="item-listing-text-skrn-vertical-align"><h6><a href="/watch?t=2&id=' + result['series'][i].id + '">' + result['series'][i].nome + '</a></h6>\
                                                </div><!-- close .item-listing-text-skrn-vertical-align -->\
                                            </div><!-- close .item-listing-text-skrn -->\
                                        </div><!-- close .item-listing-container-skrn -->\
                                    </div><!-- close .col -->';
            }

            console.log(result['series'].length);
            
            $('#search-results-series').append(results_html);
        },
        error: function (result) {
            console.log('error: ', result);
        }
    });
}
