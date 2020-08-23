import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { loadModules } from 'esri-loader';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, OnDestroy {

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  view: any;

  selectedLatitude: number;
  selectedLongitude: number;

  addressForm = this.formBuilder.group({
    addressLine1: ['',[Validators.required]],
    addressLine2: ['',[]],
    city: ['',[Validators.required]],
    state: ['',[Validators.required]],
    zipcode: ['',[Validators.required]],
    country: ['',[Validators.required]],
    latitude: ['',[Validators.required]],
    longitude: ['',[Validators.required]]
  })

  constructor(private formBuilder: FormBuilder,
    private locationService: LocationService) {}

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, Search] = await loadModules(["esri/Map", "esri/views/MapView", "esri/widgets/Search"]);

      // Configure the Map
      const mapProperties = {
        basemap: "streets-navigation-vector"
      };

      const map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [10.4515, 51.1657],
        zoom: 7,
        map: map
      };

      this.view = new MapView(mapViewProperties);
      var search = new Search({
        view: this.view
      });
      this.view.ui.add(search, "top-right");
      this.view.on("click", (evt) => {
        search.clear(); 
        this.view.popup.clear();
        if (search.activeSource) {
          var geocoder = search.activeSource.locator; // World geocode service
          var params = {
            location: evt.mapPoint 
          };
          geocoder.locationToAddress(params)
            .then((response) => { // Show the address found
              var address = response.address;
              this.locationService.getReverseGeoCoding(evt.mapPoint.latitude,evt.mapPoint.longitude).subscribe((res: any) => {
                console.log(res);
              })
              this.showPopup(address, evt.mapPoint);
            }, function(err) { // Show no address found
              this.showPopup("No address found.", evt.mapPoint);
            });
        }
      });
      
      await this.view.when(); // wait for map to load
      return this.view;
    } catch (error) {
      console.error("EsriLoader: ", error);
    }
  }

  showPopup(address, pt) {
    this.view.popup.open({
      title:  address,
      content: + Math.round(pt.longitude * 100000)/100000 + ", " + Math.round(pt.latitude * 100000)/100000,
      location: pt
    });
    console.log(address, pt.latitude, pt.longitude);
  }

  submit() {

  }

  ngOnInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}
