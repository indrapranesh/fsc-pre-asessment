import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdditionalOption, AdditionalQuestion} from '../interfaces/additionalQuestion.interface';

@Injectable({
  providedIn: 'root'
})
export class AdditionalQuestionsService {

  headers;
  questionMap = new Map<String, AdditionalQuestion>();
  optionsMap = new Map<String, Array<AdditionalOption>>();

  constructor(
    private http: HttpClient
  ) { 
    let access_token = localStorage.getItem('ACCESS_TOKEN')
    this.headers = new HttpHeaders({
        'Authorization': `Bearer ${access_token}`
    });
  }

  getAdditionalQuestions() {
    return this.http.get(environment.DYNAMICS_API_URL+ '/new_fsc_additional_questions?$select=new_fsc_question,new_is_root', {headers: this.headers});
  }
  
  getAdditionalOptions() {
    let url = environment.DYNAMICS_API_URL + '/new_fsc_additional_answers?$select=new_fsc_answer,_new_fsc_question_value,_new_next_question_value,new_fsc_outcome,new_fsc_risk_level,new_is_end';
    return this.http.get(url, {headers: this.headers});
  }

  constructTree(questions: Array<any>,answers: Array<any>) {
    let rootQuestionId: string;
    questions.map((question) => {
      this.questionMap.set(question.new_fsc_additional_questionid, question);
      if(question.new_is_root == true) {
        rootQuestionId = question.new_fsc_additional_questionid;
      }
    });
    console.log(this.questionMap);
    answers.map((answer) => {
      
      let questionOptions = this.optionsMap.get(answer._new_fsc_question_value);
      if(questionOptions == null) {
        this.optionsMap.set(answer._new_fsc_question_value, [answer]);
      } else {
        questionOptions.push(answer);
        this.optionsMap.set(answer._new_fsc_question_value, questionOptions);
      }
    });
    console.log(this.optionsMap)
  }


  addOrganizationAnswer(payload) {
    return this.http.post(environment.DYNAMICS_API_URL + '/new_org_additional_answers', payload, {headers: this.headers});
  }
}
