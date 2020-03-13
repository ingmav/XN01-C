import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JwtRequestService } from '../jwt-request.service';

@Injectable()
export class CallcenterService {

  constructor(private http: Http,   private jwtRequest:JwtRequestService) { }

  static readonly URL: string = "trabajos-pendientes";

}
