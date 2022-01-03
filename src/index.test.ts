import { expect } from "chai";
import request from "supertest";
import Pool from "pg-pool";

import { app } from "./index";
import { executeQuery } from "./poolClient";

describe("Courses route", function () {
  beforeEach("Create temporary tables", async function () {
    await executeQuery(
      "CREATE TEMPORARY TABLE courses (LIKE courses INCLUDING ALL)",
      []
    ); // This will copy constraints also
  });

  // Optionally we could insert fake data before each test, but in this case it's not needed
  // beforeEach('Insert fake data', async function () {
  //   await executeQuery('INSERT INTO pg_temp.courses (name, content) VALUES ("a_courses", "some_content")')
  // })

  afterEach("Drop temporary tables", async function () {
    await executeQuery("DROP TABLE IF EXISTS pg_temp.courses", []);
  });

  describe("POST /courses", function () {
    it("Should create a new course", async function () {
      const req = {
        name: "foo1",
        content: "content1",
      };
      await postCourse(req);

      const { rows } = await executeQuery(
        "SELECT name, content FROM courses WHERE name = $1",
        [req.name]
      );
      expect(rows).lengthOf(1);
      expect(rows[0]).to.deep.equal(req);
    });

    it("Should fail if name already exists", async function () {
      const req = {
        name: "foo1",
        content: "content1",
      };
      await postCourse(req);
      await postCourse(req, 400); // Second request should fail
    });

    it("Should fail if request is missing required params", async function () {
      await postCourse({ name: "foo1" }, 400);
      await postCourse({ content: "content1" }, 400);
      await postCourse({}, 400);
    });
  });

  async function postCourse(req: any, status = 200) {
    const { body } = await request(app).post("/courses").send(req).expect(status);
    return body;
  }
});
