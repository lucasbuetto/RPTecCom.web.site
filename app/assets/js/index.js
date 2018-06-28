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
            <li class="list-group-item">
                <i class="mx-auto fa d-inline fa-clock-o text-primary"></i>
                ${item.horary} | <b>${item.name}</b>
            </li>
        `;
        $('#scheduleList').append(template);
    };
}

function sponsorsList(jsonList) {
    for (var i = 0; i < jsonList.length; i++) {
        var item = jsonList[i];
        var template = `
            <div class="p-2">
                <a href="${item.url}" target="_blank">
                    <img class="center-block img-fluid d-block" src="${item.srcImage}" alt="${item.name}"> 
                </a>
            </div>
        `;
        $('#sponsorsList').append(template);
    };
}

$(function () {

    getComponent('GET', 'assets/json/schedule.json', 'json', null, scheduleList);
    getComponent('GET', 'assets/json/sponsors.json', 'json', null, sponsorsList);

    $('.navbar-collapse a').click(function (e) {
        if(window.outerWidth < 768) {
            $('.navbar-collapse').collapse('toggle');
        }
    });

});
