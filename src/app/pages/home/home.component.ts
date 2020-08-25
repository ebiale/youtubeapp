import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '../../services/youtube.service';
import { Video } from '../../models/youtube.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  videos: Video[] = [];
  firstPage = true;
  lastPage = false;


  constructor(private ys: YoutubeService) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  playVideo(video: Video) {
    console.log(video);
    Swal.fire({
      html:
        `<h4>${video.title}</h4>
        <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/${video.resourceId.videoId}"
        frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
        </iframe>`
    });
  }

  private loadVideos(page: string = '') {
    this.ys.getVideos(page).subscribe(res => {
      this.videos = res;
      this.lastPage = this.ys.lastPage();
      this.firstPage = this.ys.firstPage();
    });
  }

  nextPage() {
    this.loadVideos('n');
  }

  previousPage() {
    this.loadVideos('p');
  }
}
