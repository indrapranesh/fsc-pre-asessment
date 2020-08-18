import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Filter } from '../interfaces/filter.interface';
import { Question, Option} from '../interfaces/decision.interface';

@Injectable({
  providedIn: 'root'
})
export class DecisionTreeService {

  filter: Filter;
  headers;
  questionMap = new Map<String, Question>();
  optionsMap = new Map<String, Array<Option>>();

  constructor(private http: HttpClient) {
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
    });
  }

  getQuestions(filter) {
    return this.http.get(environment.DYNAMICS_API_URL+'/new_fsc_questionses?$select=new_fsc_question,new_is_root&$filter=new_filter_number eq %27'+filter+'%27', {headers: this.headers});
  } 

  getOptions() {
    return this.http.get(environment.DYNAMICS_API_URL+'/new_fsc_answerses?$select=new_answer_value,_new_fsc_question_value,_new_next_question_value,new_filter_outcome,new_end_accessment,new_scenario_code', {headers: this.headers});
  }

  constructFilter(questions: Array<any>,answers: Array<any>) {
    let rootQuestionId: string;
    questions.map((question) => {
      this.questionMap.set(question.new_fsc_questionsid, question);
      if(question.new_is_root == true) {
        rootQuestionId = question.new_fsc_questionsid;
      }
    });
    answers.map((answer) => {
      
      let questionOptions = this.optionsMap.get(answer._new_fsc_question_value);
      if(questionOptions == null) {
        this.optionsMap.set(answer._new_fsc_question_value, [answer]);
      } else {
        questionOptions.push(answer);
        this.optionsMap.set(answer._new_fsc_question_value, questionOptions);
      }
    });
    console.log(this.optionsMap);
  };

  createOrganizationResponse(payload) {
    return this.http.post(environment.DYNAMICS_API_URL+'/new_organization_answers',payload, {headers: this.headers, observe: 'response'});
  }

}
