import { StatusService } from "../model/StatusService";

interface StoryView {

}
export class StoryPresenter {
    private statusService: StatusService;
    private view: StoryView;

    public constructor(view: StoryView){
        this.statusService = new StatusService();
        this.view = view;
    }
}