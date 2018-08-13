"use strict";

function getComponent(requestType, componentPath, returnType, elementDestination, callback) {
    $.ajax({
        type: requestType,
        url: componentPath,
        cache: false,
        success: function (result) {
            if (returnType.toLowerCase() == 'json') {
                return callback(result);
            } else if (elementDestination != null) {
                $(elementDestination).html(result);
            }
        },
        error: function (result) {
            console.error(result);
        }
    });
};

function scheduleList(jsonList) {
    for (var i = 0; i < jsonList.length; i++) {
        var item = jsonList[i];
        var template = `
            <tr>
                <th scope="row">
                    <i class="mx-auto d-inline far fa-clock text-primary"></i>
                    ${item.horary}
                </th>
                <td>${item.theme}</td>
                <td>${item.speaker}</td>
                <td>${item.trail}</td>
            </tr>
            `;
            // <li class="list-group-item">
            //     <i class="mx-auto fa d-inline fa-clock-o text-primary"></i>
            //     ${item.horary} | <b>${item.name}</b>
            // </li>
        $('#scheduleList tbody').append(template);
    };
}

function sponsorsList(jsonList) {
    var template = "";
    for (var i = 0; i < jsonList.length; i++) {
        var item = jsonList[i];
        template = `
            <div class="p-2 m-2 img-thumbnail">
                <a href="${item.url}" target="_blank">
                    <img class="center-block img-fluid d-block" src="${item.srcImage}" alt="${item.name}"> 
                </a>
            </div>
        `;
        if(item.class == "gold") {
            $('#sponsorsList-gold').append(template);
        }
        else if(item.class == "silver") {
            $('#sponsorsList-silver').append(template);
        }
        else {
            $('#sponsorsList-bronze').append(template);
        }
    };
}

function themesList(jsonList) {
    for (var i = 0; i < jsonList.length; i++) {
        var item = jsonList[i];
        var template = `
            <div class="col-md-4 my-3">
                <div class="card-deck">
                    <div class="card themes">
                        <div class="card-body">
                            
                            <div class="row mb-3 icon-area">
                                <div class="text-center col">
                                    <i class="d-block mx-auto fa-7x ${item.icon}" color="${item.color}"></i>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="align-self-center col-10">
                                    <h3 class="ml-1 card-title">
                                        <b>${item.theme}</b>
                                    </h3>
                                </div>
                            </div>
                            <p class="card-text">${item.description}</p>

                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#themesList').append(template);
    };
}

function speakersList(jsonList) {
    for (var i = 0; i < jsonList.length; i++) {
        var item = jsonList[i];
        var template = `
            <div class="col-6 col-lg-4 ${item.animate}">
                <div>
                    <img src="${item.image}" class="center-block img-fluid my-3 rounded-circle" width="300">
                    <h3 class="mb-0 text-primary">
                        <b>${item.name}</b>
                    </h3>
                    <p class="text-muted">${item.theme}</p>
                </div>
            </div>
        `;
        $('#speakersList').append(template);
    };
}

function configuration(config) {

    //Set site title
    $('title').text(config.name + ' ' + config.year);

    //Set Event informations
    $('[eventDate]').text(config.eventDate);
    $('[eventPeriod]').text(config.eventPeriod);
    $('[eventText]').text(config.eventText);
    $('[eventDescription]').text(config.eventDescription);

    $('[eventlinkedin][href]').attr('href', config.eventlinkedin);
    $('[eventfacebook][href]').attr('href', config.eventfacebook);

    if(config.subscriptionUrl == null || config.subscriptionUrl == "" | config.subscriptionUrl == undefined) {
        $('[subscriptionUrl]').addClass('d-none');    
    }
    else {
        $('[subscriptionUrl][href]').attr('href', config.subscriptionUrl);
    }

    //Set Location
    var location = config.location;
    var locationTemplate = `
        <div class="container">
            <div class="row">
                <div class="col-md-6 text-center align-self-center ${location.name == '' ? 'd-none' : ''}">
                    <p class="mb-5 text-bold text-dark">
                        <strong class="text-center text-uppercase">LOCALIZAÇÃO</strong>
                        <br><a href="${location.website}" target="_blank"><img src="${location.imageSrc}" alt="${location.name}"></a>
                        <br>${location.street}
                        <br>${location.district}
                        <br>${location.phone}</p>
                    <div class="my-3 row">
                        <div class="col ${location.facebook == "" ? 'd-none' : ''}">
                        <a href="${location.facebook}" target="_blank">
                            <i class="fab fa-3x fa-facebook"></i>
                        </a>
                        </div>
                        <div class="col ${location.twitter == "" ? 'd-none' : ''}">
                        <a href="${location.twitter}" target="_blank">
                            <i class="fab fa-3x fa-twitter"></i>
                        </a>
                        </div>
                        <div class="col ${location.instagram == "" ? 'd-none' : ''}">
                        <a href="${location.instagram}" target="_blank">
                            <i class="fab fa-3x fa-instagram"></i>
                        </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 p-0 ${location.name == '' ? 'd-none' : ''}"">
                    <iframe src="${location.googleMapsEmbedUrl}" width="400" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>
                </div>

                <div class="col-md-6 text-center align-self-center ${location.name != '' ? 'd-none' : ''}">
                    <p class="mb-5 text-bold text-dark">
                        <strong class="text-center text-uppercase">LOCALIZAÇÃO</strong>
                        <br>
                        A Definir
                </div>
            </div>
        </div>
    `;
    $("#location").html(locationTemplate);

}

$(function () {

    getComponent('GET', 'assets/json/config.json?v=2.0.10', 'json', null, configuration);
    getComponent('GET', 'assets/json/schedule.json?v=2.0.10', 'json', null, scheduleList);
    getComponent('GET', 'assets/json/sponsors.json?v=2.0.10', 'json', null, sponsorsList);
    getComponent('GET', 'assets/json/themes.json?v=2.0.10', 'json', null, themesList);
    getComponent('GET', 'assets/json/speakers.json?v=2.0.10', 'json', null, speakersList);

    $('.navbar-collapse a').click(function (e) {
        if(window.outerWidth < 768) {
            $('.navbar-collapse').collapse('toggle');
        }
    });

});
