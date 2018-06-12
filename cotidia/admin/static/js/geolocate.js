'use strict';

// IMPORTANT
// Relies on Sortable.JS (https://github.com/RubaXa/Sortable)
// Include script from CDN at top of the file
//<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>

(function () {
  function Geolocate (el) {
    this.latField = document.getElementById(el.dataset.latitudeField)
    this.lngField = document.getElementById(el.dataset.longitudeField)
    var context = this
    el.addEventListener('change', function() {
      context.geolocateAddress(this.value)
    })
    this.map = document.createElement('div')
    this.map.style.height = "300px"
    this.map.innerHTML = 'Loading Google map...'
    el.parentNode.parentNode.append(this.map)
    this.loadMap()
  }

  Geolocate.prototype.geolocateAddress = function(address, map_type) {

    var geocoder = new google.maps.Geocoder()
    var context = this

    geocoder.geocode( { 'address': address }, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          context.latField.value = results[0].geometry.location.lat().toFixed(8)
          context.lngField.value = results[0].geometry.location.lng().toFixed(8)
          context.latField.parentNode.parentNode.classList.remove('form__group--inactive')
          context.lngField.parentNode.parentNode.classList.remove('form__group--inactive')
          context.loadMap(map_type)
        }

        else {
            alert("Geocode was not successful for the following reason: " + status)
        }
      }
    )
  }

  Geolocate.prototype.loadMap = function() {

    var context = this
    var lat = this.latField.value || 51.509865
    var lng = this.lngField.value || -0.118092
    var zoom = 10
    var marker = false

    if (this.latField.value) {
      zoom = 14
      marker = true
    }

    var mapOptions = {
      'zoom': zoom,
      'mapTypeId': google.maps.MapTypeId.ROADMAP,
      'center': new google.maps.LatLng(lat, lng),
      'scrollwheel': false
    }
    var map = new google.maps.Map(this.map, mapOptions)

    if (marker) {
      marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lng),
        draggable: true
      })
      google.maps.event.addListener(marker, 'dragend', function() {
          context.updateLatLon(marker.getPosition())
        }
      )
    }
  }

  Geolocate.prototype.updateLatLon = function(position) {
    this.latField.value = position.lat()
    this.lngField.value = position.lng()
  }

  /////////////////////////////////////////////////////////////////////////////

  // Bootstrap any file uploaders

  function documentReady () {
    return (document.readyState === 'interactive' || document.readyState === 'complete')
  }

  function bootstrap () {
    document.removeEventListener('readystatechange', bootstrap)

    var locationFields = document.querySelectorAll('[data-geolocate]')

    for (var i = 0; i < locationFields.length; i++) {
      new Geolocate(locationFields[i])
    }
  }

  if (documentReady()) {
    bootstrap()
  } else {
    document.addEventListener('readystatechange', bootstrap)
  }
}())
