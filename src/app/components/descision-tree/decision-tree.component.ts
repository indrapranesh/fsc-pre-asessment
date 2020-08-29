import { Component, OnInit } from '@angular/core';
import { DecisionTreeService } from 'src/app/services/decision-tree.service';
import { CurrentDecision, FilterResponse, CurrentOption} from '../../interfaces/currentQuestion.interface';
import { Option } from 'src/app/interfaces/decision.interface';
import { StepsService } from '../../services/steps.service';
import { InitService } from '../../services/init.service';
import { DynamicsAuthService } from '../../services/dynamics-auth.service';
import { Organization} from '../../interfaces/organization.interface';

@Component({
  selector: 'app-decision-tree',
  templateUrl: './decision-tree.component.html',
  styleUrls: ['./decision-tree.component.scss']
})
export class DecisionTreeComponent implements OnInit {

  filterLevel = 1;
  questions = [];
  answers = [];
  rootQuestionId: string;
  showResult: boolean = false;
  resultText: string = '';
  decisions: CurrentDecision[] = [];
  orgResponse: FilterResponse[] = [];
  filterResults = {};

  isSubmitting: boolean = false;
  isLoadingFilter: boolean = false;
  isEnd: boolean = false;
  organization: Organization;

  constructor(
    private decisionTreeService: DecisionTreeService,
    private stepService: StepsService,
    private initService: InitService,
    private authService: DynamicsAuthService
  ) {
  }

  getOrganization() {
    this.initService.getOrganization().subscribe((res: any) => {
      this.organization = res;
      localStorage.setItem('organization',JSON.stringify(this.organization));
    });
    this.initService.getLegalRep().subscribe((res: any) => {
      localStorage.setItem('legalRep', JSON.stringify(res.value[0]));
    });
  }

  getDecisionTree(filter) {
    this.isLoadingFilter = true;
    this.decisionTreeService.getQuestions(filter).subscribe((res: any) => {
      this.questions = res.value;
      this.questions.map((question) => {
        if(question.new_is_root) {
          this.rootQuestionId = question.new_fsc_questionsid;
        }
      })
      this.decisionTreeService.getOptions().subscribe((res:any) => {
        this.answers = res.value;
        this.decisionTreeService.constructFilter(this.questions,this.answers);
        let rootQuestion: any = this.decisionTreeService.questionMap.get(this.rootQuestionId);
        this.decisions.push({
          questionId: rootQuestion.new_fsc_questionsid,
          questionText: rootQuestion.new_fsc_question,
          options: [], 
        })
        this.decisions[0].questionText = rootQuestion.new_fsc_question;
        this.decisions[0].questionId = rootQuestion.new_fsc_questionsid;
        let options = this.decisionTreeService.optionsMap.get(this.rootQuestionId);
        console.log(this.decisionTreeService.questionMap);
        console.log(this.decisionTreeService.optionsMap);
        options.map((option) => {
          this.decisions[0].options.push({
            optionText: option.new_answer_value,
            optionId: option.new_fsc_answersid,
            nextQuestionId: option._new_next_question_value,
            outcome: option.new_filter_outcome,
            isSelected: false,
            scenarioCode: option.new_scenario_code
          });
        });
        this.isLoadingFilter = false;
      })
    });
  }

  nextQuestion(decision: CurrentDecision, option: CurrentOption, index) {
    decision.options.map((option) => {
      option.isSelected = false;
    });
    option.isSelected = true;
    // remove array elements if decision changes
    if((this.decisions.length -1) > index) {
      this.showResult = false;
      this.decisions.splice(index + 1, this.decisions.length);
    };
    if((this.orgResponse.length) > index) {
      this.showResult = false;
      this.orgResponse.splice(index, this.orgResponse.length);
    }
    // if last step
    if(!option.nextQuestionId) {
      this.getResult(decision.questionId, option);
    } else {
      this.orgResponse.push({
        questionId: decision.questionId,
        option: option.optionText,
        outcome:null
      });
      this.decisionTreeService.optionsMap.forEach((value: Option[], key: string) => {
        if(option.nextQuestionId == key ) {
          let question = this.decisionTreeService.questionMap.get(key);
          this.pushNextQuestion(key, value, question)
        } 
      });
    }
  }

  // push next question if there is one
  pushNextQuestion(key, value:Array<any>, question) {
    console.log('pushing next question',value);
    this.decisions.push({
      questionId: key,
      questionText: question.new_fsc_question,
      options: []
    });
    value.map((value) => {
      this.decisions[this.decisions.length - 1].options.push(
        {
          optionId: value.new_fsc_answersid,
          optionText: value.new_answer_value,
          nextQuestionId: value._new_next_question_value,
          outcome: value.new_filter_outcome,
          isSelected: false,
          endAccessment: value.new_end_accessment,
          scenarioCode: value.new_scenario_code
        }
      )
    })
  }

  //show result of current filter
  getResult(questionId, option) {
    console.log(option);
    this.orgResponse.push({
      questionId: questionId,
      option: option.optionText,
      outcome: option.outcome
    });
    console.log(option);
    this.filterResults[this.filterLevel] = {
      outcome: option.outcome,
      scenarioCode: option.scenarioCode,
      outcomeCode: null,
      filterLevel: this.filterLevel
    };
    console.log(this.filterResults);
    if(option.endAccessment) {
      this.isEnd = true;
      console.log(this.isEnd);
    } else {
      this.isEnd = false;
    }
    this.showResult = true;
    this.resultText = option.outcome;
  };
  

  // submitting response of single filter
  
  submitResponse() {
    this.isSubmitting = true;
    this.nextFilter();
    /* submitting Organization Response to Dynamics */
    // let payloads = this.getOrgResponsePayload();
    // console.log(payloads);
    // payloads.forEach((payload, index) => {
    //   this.decisionTreeService.createOrganizationResponse(payload).subscribe(
    //     (res) => {
    //       console.log(res);
    //       if((index+1) == payloads.length) {
    //         this.isSubmitting = false;
    //         console.log('successfully udpated');
    //         this.nextFilter();
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // });
  }

  getOrgResponsePayload() {
    let payload = [];
    this.orgResponse.map((res) => {
      let questionId = 'new_fsc_questionses('+res.questionId+')'
      payload.push({
        "new_org_answer": res.option,
        "new_fsc_question@odata.bind": questionId,
        "new_org_outcome": res.outcome,
        "new_fsc_organization@odata.bind": "accounts(58cf986f-fccc-ea11-a815-000d3a0a82c9)"
      });
    });
    return payload;
  }

  nextFilter() {
    this.showResult = false;
    this.isSubmitting = false;
    this.clearVar();
    this.filterLevel += 1;
    if(this.filterLevel <= 3) {
      this.getDecisionTree(this.filterLevel);
    }
    if(this.filterLevel > 3) {
      localStorage.setItem('result', JSON.stringify(this.filterResults));
      this.stepService.currentStep.next(1);
      localStorage.setItem('currentStep', '1');
    }
  }

  clearVar() {
    this.decisions = [];
    this.questions = [];
    this.answers = [];
    this.decisionTreeService.optionsMap.clear();
    this.decisionTreeService.questionMap.clear();
  }

  async ngOnInit() {
    await this.authService.authenticate();
    this.getDecisionTree(this.filterLevel);
    this.getOrganization();
  }

}
