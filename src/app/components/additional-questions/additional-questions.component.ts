import { Component, OnInit } from '@angular/core';
import { AdditionalQuestionsService } from '../../services/additional-questions.service';
import { CurrentDecision, FilterResponse, CurrentOption} from '../../interfaces/currentQuestion.interface';
import { AdditionalOption } from 'src/app/interfaces/additionalQuestion.interface';
 
@Component({
  selector: 'app-additional-questions',
  templateUrl: './additional-questions.component.html',
  styleUrls: ['./additional-questions.component.scss']
})
export class AdditionalQuestionsComponent implements OnInit {

  questions = [];
  answers = [];
  rootQuestionId: string;
  showResult: boolean = false;
  resultText: string = '';
  decisions: CurrentDecision[] = [];
  orgResponse: FilterResponse[] = [];

  isSubmitting: boolean = false;
  isLoadingFilter: boolean = false;
  isEnd: boolean = false;

  constructor(
    private additionalService: AdditionalQuestionsService
  ) { 
    this.getDecisionTree();
  }

  getDecisionTree() {
    this.isLoadingFilter = true;
    this.additionalService.getAdditionalQuestions().subscribe((res: any) => {
      this.questions = res.value;
      this.questions.map((question) => {
        if(question.new_is_root) {
          this.rootQuestionId = question.new_fsc_additional_questionid;
        }
      });
      this.additionalService.getAdditionalOptions().subscribe((res: any) => {
        this.answers = res.value;
        this.additionalService.constructTree(this.questions, this.answers);
        let rootQuestion: any = this.additionalService.questionMap.get(this.rootQuestionId);
        console.log(this.rootQuestionId);
        this.decisions.push({
          questionId: rootQuestion.new_fsc_additional_questionid,
          questionText: rootQuestion.new_fsc_question,
          options: [], 
        });
        this.decisions[0].questionText = rootQuestion.new_fsc_question;
        this.decisions[0].questionId = rootQuestion.new_fsc_additional_questionid;
        let options = this.additionalService.optionsMap.get(this.rootQuestionId);
        console.log(this.additionalService.questionMap);
        console.log(this.additionalService.optionsMap);
        options.map((option) => {
          this.decisions[0].options.push({
            optionText: option.new_fsc_answer,
            optionId: option.new_fsc_additional_answerid,
            nextQuestionId: option._new_next_question_value,
            outcome: option.new_fsc_outcome,
            isSelected: false,
            riskLevel: option.new_fsc_risk_level,
            endAccessment: option.new_is_end
          }); 
        });
        this.isLoadingFilter = false;
      })
    })
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
        option: option.optionId
      });
      this.additionalService.optionsMap.forEach((value: AdditionalOption[], key: string) => {
        if(option.nextQuestionId == key ) {
          let question = this.additionalService.questionMap.get(key);
          this.pushNextQuestion(key, value, question)
        } 
      });
    }
  };

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
          optionText: value.new_fsc_answer,
          optionId: value.new_fsc_additional_answerid,
          nextQuestionId: value._new_next_question_value,
          outcome: value.new_fsc_outcome,
          isSelected: false,
          riskLevel: value.new_fsc_risk_level,
          endAccessment: value.new_is_end
        }
      )
    })
  };

  getResult(questionId, option) {
    console.log(option);
    this.orgResponse.push({
      questionId: questionId,
      option: option.optionId
    });
    console.log(this.orgResponse);
    console.log(option);
    if(option.endAccessment) {
      this.isEnd = true;
      console.log(this.isEnd);
    } else {
      this.isEnd = false;
    }
    this.showResult = true;
    this.resultText = option.riskLevel;
  };

  ngOnInit(): void {
  }

}
