import { Component, OnInit } from '@angular/core';
import { DecisionTreeService } from 'src/app/services/decision-tree.service';
import { Question, Option} from '../../interfaces/decision.interface';

@Component({
  selector: 'app-descision-tree',
  templateUrl: './descision-tree.component.html',
  styleUrls: ['./descision-tree.component.scss']
})
export class DescisionTreeComponent implements OnInit {

  filterLevel = 1;
  questions = [];
  answers = [];
  rootQuestionId;
  currentQuestion = {
    questionText: '',
    options: []
  };

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
        this.currentQuestion.questionText = rootQuestion.new_fsc_question;
        let options = this.decisionTreeService.optionsMap.get(this.rootQuestionId);
        options.map((option) => {
          this.currentQuestion.options.push(option.new_answer_value)
        });
        console.log(this.decisionTreeService.optionsMap);
        console.log(this.currentQuestion);
      })
    });
  }


  ngOnInit(): void {
  }

}
