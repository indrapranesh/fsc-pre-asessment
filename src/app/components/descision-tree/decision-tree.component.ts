import { Component, OnInit } from '@angular/core';
import { DecisionTreeService } from 'src/app/services/decision-tree.service';
import { CurrentDecision, FilterResponse, CurrentOption} from '../../interfaces/currentQuestion.interface';
import { Option } from 'src/app/interfaces/decision.interface';

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

  isLoadingFilter: boolean = false;

  constructor(
    private decisionTreeService: DecisionTreeService
  ) {
    this.getDecisionTree(this.filterLevel);
  }

  getDecisionTree(filter) {
    this.decisionTreeService.getQuestions(filter).subscribe((res: any) => {
      this.questions = res.value;
      this.questions.map((question) => {
        if(question.new_is_root) {
          this.rootQuestionId = question.new_fsc_questionsid;
        }
      })
      this.decisionTreeService.getOptions(filter).subscribe((res:any) => {
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
        options.map((option) => {
          this.decisions[0].options.push({
            optionText: option.new_answer_value,
            optionId: option.new_fsc_answersid,
            nextQuestionId: option._new_next_question_value,
            outcome: option.new_filter_outcome,
            isSelected: false
          })
        });
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
          this.pushNextQuestion(key, value, question);
        } 
      });
    }
  }

  // push next question if there is one
  pushNextQuestion(key, value, question) {
    console.log('pushing next question')
    this.decisions.push({
      questionId: key,
      questionText: question.new_fsc_question,
      options: [{
        optionId: value[0].new_fsc_answersid,
        optionText: value[0].new_answer_value,
        nextQuestionId: value[0]._new_next_question_value,
        outcome: value[0].new_filter_outcome,
        isSelected: false
      },
      {
        optionId: value[1].new_fsc_answersid,
        optionText: value[1].new_answer_value,
        nextQuestionId: value[1]._new_next_question_value,
        outcome: value[1].new_filter_outcome,
        isSelected: false
      },
    ]
    });
  }

  //show result of current filter
  getResult(questionId, option) {
    this.orgResponse.push({
      questionId: questionId,
      option: option.optionText,
      outcome: option.outcome
    });
    console.log(this.orgResponse);
    this.showResult = true;
    this.resultText = option.outcome;
  };
  

  // submit response of single filter
  
  submitResponse() {
    this.isLoadingFilter = true;
    let payloads = this.getOrgResponsePayload();
    console.log(payloads);
    payloads.forEach((payload, index) => {
      this.decisionTreeService.createOrganizationResponse(payload).subscribe(
        (res) => {
          console.log(res);
          if((index+1) == payloads.length) {
            this.isLoadingFilter = false;
            console.log('successfully udpated');
            this.nextFilter();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  getOrgResponsePayload() {
    let payload = [];
    this.orgResponse.map((res) => {
      let questionId = 'accounts('+res.questionId+')'
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
    this.decisions = [];
    this.questions = [];
    this.answers = [];
    this.filterLevel += 1;
    if(this.filterLevel <= 3) {
      console.log('nextFilter loading');
      //this.getDecisionTree(this.filterLevel);
    }
  }

  ngOnInit(): void {
  }

}
