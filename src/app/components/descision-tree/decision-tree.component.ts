import { Component, OnInit } from '@angular/core';
import { DecisionTreeService } from 'src/app/services/decision-tree.service';
import { Decision, FilterResponse} from '../../interfaces/currentQuestion.interface';
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
  decisions: Decision[] = [];
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
            outcome: option.new_filter_outcome
          })
        });
      })
    });
  }

  nextQuestion(decision, option, index) {
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
        optionId: option.optionId
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
        outcome: value[0].new_filter_outcome
      },
      {
        optionId: value[1].new_fsc_answersid,
        optionText: value[1].new_answer_value,
        nextQuestionId: value[1]._new_next_question_value,
        outcome: value[1].new_filter_outcome
      },
    ]
    });
  }

  //show result of current filter
  getResult(questionId, option) {
    this.orgResponse.push({
      questionId: questionId,
      optionId: option.optionId
    });
    this.showResult = true;
    this.resultText = option.outcome;
  };
  

  // submit response of single filter
  
  submitResponse() {
    this.isLoadingFilter = true;
  }

  ngOnInit(): void {
  }

}
