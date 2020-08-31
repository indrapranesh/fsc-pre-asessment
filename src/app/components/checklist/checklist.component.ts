import { Component, OnInit } from '@angular/core';
import { ChecklistService } from "../../services/checklist.service";
import { Scenario } from "../../interfaces/checklist.interface";
import { StepsService } from 'src/app/services/steps.service';
import { TranslateService, GoogleObj } from 'src/app/services/translate.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';
import { languages } from '../../constants/languages';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  results;
  scenarios: Scenario[] = [];
  outcomes = [];
  requirementTypes = [];
  standards = [];
  _requirements: Array<any> = [];
  requirements: Array<any> = [];
  filterLevels = [];
  headers;
  isInputLoading = false;
  selectedLanguage = 'en';
  languages = [];
  orgId;


  expandSet = new Set<number>();

  isChecklistLoading: boolean;
  inputLoading: boolean;

  listofColumns = [
    {
      name: 'Requirement',
      sortOrder: null
    },
    {
      name: 'Requirement Type',
      listOfFilter: [
        { text: 'Informatory', value: 'Informative (non-normative)' },
        { text: 'Obligatory', value: 'Obligatory' },
        { text: 'Explanatory', value: 'Explanatory (e.g. NOTES etc.)' },
        { text: 'Optional', value: 'Optional' },
        { text: 'Not Applicable', value: 'Not Applicable' },
      ],
      filterFn: (type: string, standard) => standard.requirementType.index(type) !== -1
    }
  ]

  inputForm = this.formBuilder.group({
    input: []
  });
 
  constructor(
    private checkListService: ChecklistService,
    private stepService: StepsService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private translate: TranslateService
  ) {
    let org= JSON.parse(localStorage.getItem('organization'));
    this.orgId = org.accountid; 
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
    });
    this.getResultArray();
    if(localStorage.getItem('requirements')) {
      this._requirements = JSON.parse(localStorage.getItem('requirements'));
    } else {
      this.loadData();
    }
    this.languages = languages;
  }

  getResultArray() {
    this.results = JSON.parse(localStorage.getItem('result'));
    this.outcomes.push(this.results[1]);
    this.outcomes.push(this.results[2]);
    this.outcomes.push(this.results[3]);
    console.log('results',typeof(this.results));
  }

  // Load Default Values from the tables Filter Levels, Requirement Types, Standards

  loadData() {
    this.isChecklistLoading = true;
    this.checkListService.getFilterLevels().subscribe((res: any) => {
      this.filterLevels = res.value;
    });
    this.checkListService.getRequirementType().subscribe((res: any) => {
      this.requirementTypes = res.value;
      console.log(this.requirementTypes);
    });
    this.checkListService.getStandards().subscribe((res: any) => {
      this.standards = res.value;
      console.log(this.standards);
      this.getRequirements();
    });
  }

  //Get Requirements based on the scenario code 

  getRequirements() {
    this.checkListService.getCocScenarios().subscribe((res: any)=> {
      this.scenarios = res.value;
      console.log(this.scenarios);
      this.outcomes.map((outcome) => {
        this.scenarios.map((scenario) => {
          if(outcome.scenarioCode == 14) {
            outcome['scenarioId'] = null;
          } else if(outcome.scenarioCode == scenario.fsc_scenario_code) {
            outcome['scenarioId'] = scenario.fsc_coc_scenariosid;
          }
        })
      });
      this.scenarios.map((scenario) => {
        this.filterLevels.map((filterLevel) => {
          if(scenario._fsc_filter_code_value == filterLevel.fsc_coc_scenarios_filterid) {
            scenario.filterLevel = filterLevel.fsc_filter_code;
          }
        })
      });
      this.checkListService.getRequirementPerScenario(this.outcomes).subscribe((res:any) => {
        this._requirements = res.value;
        let requirements = this._requirements.filter((obj, index, self) => {
          return index === self.findIndex((t) => {
            return t['_fsc_std_element_id_value'] === obj['_fsc_std_element_id_value'];
          })
        })
        this._requirements = [];
        this._requirements = requirements;
        this.processRequirements();
      });
    })
  };

  // Process the Requirements mapping Requirement Type, Standards and Scenarios Tables

  async processRequirements() {
    this._requirements.map((requirement) => {
      this.requirementTypes.map((type) => {
        if(type.fsc_requirementtypeid == requirement._fsc_requirement_code_value) {
          requirement['requirementType'] = type.fsc_requirement_comments;
          requirement['expanded'] = false;
        }
      });
      this.standards.map((standard) => {
        if(standard.fsc_standards_elementsid == requirement._fsc_std_element_id_value) {
          requirement['standardContent'] = standard.fsc_element_content;
        }
      });
      this.scenarios.map((scenario) => {
        if(scenario.fsc_coc_scenariosid == requirement._fsc_scenario_code_value) {
          requirement['scenarioCode'] = scenario.fsc_scenario_code;
          requirement['filterLevel'] = scenario.filterLevel;
        }
      });
    });
    localStorage.setItem('requirements', JSON.stringify(this._requirements));
    this.requirements = this._requirements;
    console.log(this._requirements);
    this.isChecklistLoading = false;
  }

  //expand row 
  onExpandChange(id: number, checked: boolean): void {
    console.log('expanding');
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  submitInput(requirement) {
    console.log(requirement);
    console.log(this.inputForm.value.input);
    this.inputLoading = true;
    let payload  = {
      'new_fsc_requirment_type_per_coc_scenario@odata.bind': '/fsc_requirment_type_per_coc_scenario_stds('+requirement.fsc_requirment_type_per_coc_scenario_stdid + ')',
      'new_coc_input': this.inputForm.value.input,
      "new_fsc_organization@odata.bind": `accounts(${this.orgId})`
    }
    this.checkListService.createOrgRequirement(payload).subscribe((res)=> {
      this.inputLoading = true;
      this._requirements.map((req) => {
        if(req._fsc_std_element_id_value == requirement._fsc_std_element_id_value) {
          req['cocInput'] = this.inputForm.value.input;
        }
        localStorage.setItem('requirements', JSON.stringify(this._requirements));
        this.inputLoading =false;
      });
      this.inputLoading = false;
      this.message.success('Input Added', {
        nzDuration: 3000
      });
    });
  }

  async translateRequirements(code) {
    let url = 'https://translation.googleapis.com/language/translate/v2?key=';
    let key = 'AIzaSyAb8GQQOzmlSo_FM5Ziwps7bQJ7eaIA-KM';
    let contents = [];
    this._requirements.map((requirement) => {
      let payload: GoogleObj = {
        q: requirement.standardContent,
        target: code
      }
      contents.push(this.http.post(url+key,payload));
    });
    forkJoin(contents).subscribe((results: Array<any>) => {
      this._requirements.map((requirement,index) => {
        console.log(results);
        requirement.standardContent = results[index].data.translations[0].translatedText;
      });
      localStorage.setItem('requirements', JSON.stringify(this._requirements));
    });
  }

  // Go to next Step
  next() {
    this.stepService.currentStep.next(3);
    localStorage.setItem('currentStep', '3');
  }

  ngOnInit(): void {
  }

}
