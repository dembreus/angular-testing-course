import { CoursesService } from "./courses.service";
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";

describe("CoursesService", () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("noc courses returned");

      expect(courses.length).toBe(12, "incorrect number of courses");

      const course = courses.find((course) => course.id == 12);

      expect(course.titles.description).toBe("Angular Testing Course");
    });

    const request = httpTestingController.expectOne("/api/courses");

    expect(request.request.method).toEqual("GET");

    request.flush({ payload: Object.values(COURSES) });
  });

  it("should find a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy("no course returned");
      expect(course.id).toBe(12, "incorrect course");
    });

    const request = httpTestingController.expectOne("/api/courses/12");

    expect(request.request.method).toEqual("GET");

    request.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const request = httpTestingController.expectOne("/api/courses/12");

    expect(request.request.method).toEqual("PUT");

    expect(request.request.body.titles.description).toEqual(
      changes.titles.description
    );

    request.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
