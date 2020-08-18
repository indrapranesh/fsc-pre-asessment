import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  headers;

  constructor(private http: HttpClient) { 
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
    });
  }

  getFilterLevels() {
    return this.http.get(environment.DYNAMICS_API_URL + '/fsc_coc_scenarios_filters?$select=fsc_filter_code',{headers: this.headers});
  }

  getRequirementPerScenario(outcomes: Array<any>) {
    let outcomeIds = [];
    outcomes.map((outcome) => {
      outcomeIds.push(outcome.scenarioId);
    });
    let url = environment.DYNAMICS_API_URL + '/fsc_requirment_type_per_coc_scenario_stds?$select=_fsc_scenario_code_value,_fsc_std_element_id_value,_fsc_requirement_code_value&$filter=(_fsc_scenario_code_value eq %27' + outcomeIds[0] + '%27' + ' or _fsc_scenario_code_value eq %27' + outcomeIds[1] + '%27'+ ' or _fsc_scenario_code_value eq %27' + outcomeIds[2] + '%27)' + ' and _fsc_requirement_code_value ne null';
    return this.http.get(url ,{headers: this.headers});
  }

  getCocScenarios() {
    return this.http.get(environment.DYNAMICS_API_URL+'/fsc_coc_scenarioses?$select=fsc_scenario_code,_fsc_filter_code_value',{headers: this.headers});
  }

  getRequirementType() {
    return this.http.get(environment.DYNAMICS_API_URL+'/fsc_requirementtypes?$select=fsc_requirement_comments',{headers: this.headers});
  }

  getStandards() {
    return this.http.get(environment.DYNAMICS_API_URL+'/fsc_standards_elementses?$select=fsc_element_content,fsc_display_order,fsc_element_reference,fsc_is_requirement',{headers: this.headers});
  }

}
