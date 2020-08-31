import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { loadModules } from 'esri-loader';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { StepsService } from 'src/app/services/steps.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, OnDestroy {

  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  view: any;
  mapProperties = {
    basemap: "streets-navigation-vector"
  };
  address = '';
  sites = [];

  map;
  graphicsLayer;
  isLoading: boolean = false;
  locationFound: boolean = false;
  locationAdded: boolean = false;
  isLocationAdding: boolean = false;

  selectedLatitude= 0;
  selectedLongitude= 0;

  siteForm = this.formBuilder.group({
    siteName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    address: ['',[Validators.required]],
    city: ['',[Validators.required]],
    state: ['',[Validators.required]],
    zipcode: ['',[Validators.required, Validators.pattern('^[0-9]*$')]],
    country: ['',[Validators.required]]
  })

  constructor(private formBuilder: FormBuilder,
    private locationService: LocationService,
    private stepService: StepsService,
    private message: NzMessageService) {
      if(localStorage.getItem('sites')) {
        this.locationAdded = true;
      }
    }

  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Map, MapView, Search, Graphic, GraphicsLayer] = await loadModules(["esri/Map", "esri/views/MapView", "esri/widgets/Search","esri/Graphic", "esri/layers/GraphicsLayer"]);

      // Configure the Map
      const mapProperties = {
        basemap: "streets-navigation-vector"
      };

      this.map = new Map(mapProperties);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: [10.4515, 51.1657],
        zoom: 5,
        map: this.map
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

  async findLocation() {
    this.isLoading = true;
    const [Map, MapView, Graphic, GraphicsLayer] = await loadModules(["esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"]);
    this.address = this.siteForm.value.address+ ' ' + this.siteForm.value.city+ ' ' +
                 this.siteForm.value.state+ ' ' + this.siteForm.value.country;
    console.log(this.address);
    this.locationService.getGeocoding(this.address).subscribe((res: any) => {
      if(res.candidates [0]) {
        this.selectedLongitude = res.candidates[0].location.x;
        this.selectedLatitude = res.candidates[0].location.y;
        this.graphicsLayer = new GraphicsLayer();
        this.locationFound = true;
        var point = {
          type: "point",
          longitude: this.selectedLongitude,
          latitude: this.selectedLatitude
        };
        let simpleMarkerSymbol = {
          type: "simple-marker",
          color: [255, 0, 4],  //red
          outline: {
            color: [255, 0, 4],  //red
            width: 1
          }
        };
        let pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol
        });
        this.graphicsLayer.add(pointGraphic);
        this.map.add(this.graphicsLayer);
        this.view.goTo({
          center: [this.selectedLongitude, this.selectedLatitude],
          zoom: 10
        });
        this.isLoading = false;
      }
    })
  }

  addLocation() {
    this.isLocationAdding = true;
    let org= JSON.parse(localStorage.getItem('organization'));
    if(org.accountid) {
      let payload = {
        'fsc_name': this.siteForm.value.siteName,
        'fsc_address': this.address,
        'fsc_CoCCompany@odata.bind': '/accounts('+org.accountid+')',
        'fsc_latitude': this.selectedLatitude,
        'fsc_longitude': this.selectedLongitude,
        'fsc_pincode': this.siteForm.value.zipcode,
        'statecode': 1
      }
      this.locationService.createSiteLocation(payload).subscribe((res) => {
        this.isLocationAdding = false;
        this.locationAdded = true;
        this.locationFound = false;
        this.siteForm.reset();
        this.message.success('Site Location Added', {
          nzDuration: 3000
        });
        if(localStorage.getItem('sites')) {
          this.sites = JSON.parse(localStorage.getItem('sites'));
          this.sites.push({latitude: this.selectedLatitude, longitude: this.selectedLongitude})
          localStorage.setItem('sites',JSON.stringify(this.sites));
        } else {
          let site = [{
            latitude: this.selectedLatitude,
            longitude: this.selectedLongitude
          }]
          localStorage.setItem('sites',JSON.stringify(site));
        }
      })
    }
  }

  next() {
    this.stepService.currentStep.next(8);
    localStorage.setItem('currentStep', '8');
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
