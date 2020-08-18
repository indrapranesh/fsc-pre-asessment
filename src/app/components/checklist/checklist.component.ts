import { Component, OnInit } from '@angular/core';
import { ChecklistService } from "../../services/checklist.service";
import { Scenario } from "../../interfaces/checklist.interface";
import { StepsService } from 'src/app/services/steps.service';

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
  _requirements = [];
  requirements = [];
  filterLevels = [];


  standardsFilter1 = [];
  standardsFilter2 = [];
  standardsFilter3 = [];

  isChecklistLoading: boolean;
 
  constructor(
    private checkListService: ChecklistService,
    private stepService: StepsService
  ) {
    this.isChecklistLoading = true;
    this.getResultArray();
    this.loadData();
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
          if(outcome.scenarioCode == scenario.fsc_scenario_code) {
            outcome['scenarioId'] = scenario.fsc_coc_scenariosid;
          }
        })
      });
      this.scenarios.map((scenario) => [
        this.filterLevels.map((filterLevel) => {
          if(scenario._fsc_filter_code_value == filterLevel.fsc_coc_scenarios_filterid) {
            scenario.filterLevel = filterLevel.fsc_filter_code;
          }
        })
      ])
      console.log(this.outcomes);
      this.checkListService.getRequirementPerScenario(this.outcomes).subscribe((res:any) => {
        this._requirements = res.value;
        this.processRequirements();
      });
    })
  };

  // Process the Requirements mapping Requirement Type, Standards and Scenarios Tables

  processRequirements() {
    this._requirements.map((requirement) => {
      this.requirementTypes.map((type) => {
        if(type.fsc_requirementtypeid == requirement._fsc_requirement_code_value) {
          requirement['requirementType'] = type.fsc_requirement_comments;
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
      })
    });
    console.log(this._requirements);
    this.divideRequirements()
  }

  // Divide requirements based on the three filter outcomes

  divideRequirements() {
    this._requirements.map((requirement) => {
      if(requirement.filterLevel == 1) {
        this.standardsFilter1.push(requirement);
      }
      if(requirement.filterLevel == 2) {
        this.standardsFilter2.push(requirement);
      }
      if(requirement.filterLevel == 3) {
        this.standardsFilter3.push(requirement);
      }
    });
    this.isChecklistLoading = false;
    console.log(this.standardsFilter1);
    console.log(this.standardsFilter2);
    console.log(this.standardsFilter3);
  }

  // Go to next Step

  next() {
    this.stepService.currentStep.next(3);
    localStorage.setItem('currentStep', '3');
  }

  ngOnInit(): void {
  }

}
