# Manual Testing Guide - Task Manager API

This guide provides comprehensive scenarios for manually testing the Task Manager API. Use tools like **Postman**, **curl**, **Thunder Client**, or the built-in **Swagger UI**.

## Prerequisites

1. Start the API: `dotnet run` in the TaskManagerAPI directory
2. API will be available at: `https://localhost:5001`
3. Swagger UI: Navigate to `https://localhost:5001` in your browser

## Test Scenarios

### 1. Get All Tasks

**Purpose**: Verify the API returns all tasks

**Method**: `GET`
**URL**: `/api/tasks`
**Expected**: Status 200, Array of tasks

```bash
curl -X GET "https://localhost:5001/api/tasks" -k
```

**Expected Response**:
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "status": "InProgress",
    "priority": "High",
    ...
  }
]
```

**Test Cases**:
- ✓ Response status is 200 OK
- ✓ Response contains an array
- ✓ Each task has required fields (id, title, status, priority)
- ✓ Seeded data is present (at least 3 tasks)

---

### 2. Get Tasks with Filters

**Purpose**: Test filtering capabilities

#### Filter by User ID

**Method**: `GET`
**URL**: `/api/tasks?userId=1`

**Expected**: Status 200, Only tasks for user 1

**Test Cases**:
- ✓ All returned tasks have userId = 1
- ✓ Tasks from other users are not included

#### Filter by Status

**Method**: `GET`
**URL**: `/api/tasks?status=Todo`

**Expected**: Status 200, Only tasks with status "Todo"

**Test Cases**:
- ✓ All returned tasks have status = "Todo"
- ✓ Tasks with other statuses are not included

#### Combined Filters

**Method**: `GET`
**URL**: `/api/tasks?userId=1&status=InProgress`

**Expected**: User 1's tasks with status "InProgress"

---

### 3. Get Task by ID

**Purpose**: Retrieve a specific task

**Method**: `GET`
**URL**: `/api/tasks/1`
**Expected**: Status 200, Task with ID 1

```bash
curl -X GET "https://localhost:5001/api/tasks/1" -k
```

**Test Cases**:
- ✓ Returns the correct task
- ✓ All fields are populated correctly

#### Negative Test: Invalid ID

**Method**: `GET`
**URL**: `/api/tasks/999`
**Expected**: Status 404 Not Found

**Test Cases**:
- ✓ Returns 404 status code
- ✓ Error message mentions task not found

---

### 4. Create a New Task

**Purpose**: Test task creation with valid data

**Method**: `POST`
**URL**: `/api/tasks`
**Headers**: `Content-Type: application/json`
**Body**:
```json
{
  "title": "Write test cases",
  "description": "Create comprehensive test scenarios",
  "priority": "High",
  "dueDate": "2024-12-31T23:59:59Z",
  "userId": 1,
  "categoryId": 1
}
```

**Expected**: Status 201 Created

```bash
curl -X POST "https://localhost:5001/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write test cases",
    "description": "Create comprehensive test scenarios",
    "priority": "High",
    "dueDate": "2024-12-31T23:59:59Z",
    "userId": 1,
    "categoryId": 1
  }' -k
```

**Test Cases**:
- ✓ Returns 201 Created
- ✓ Response includes the created task with an ID
- ✓ Location header contains the URL to the new task
- ✓ Default status is "Todo"
- ✓ CreatedAt is set to current time

#### Validation Tests

##### Empty Title

**Body**:
```json
{
  "title": "",
  "userId": 1
}
```

**Expected**: Status 400 Bad Request
**Test**: ✓ Error message mentions title is required

##### Title Too Long

**Body**:
```json
{
  "title": "A".repeat(201),
  "userId": 1
}
```

**Expected**: Status 400 Bad Request
**Test**: ✓ Error message mentions character limit

##### Past Due Date

**Body**:
```json
{
  "title": "Test Task",
  "dueDate": "2020-01-01T00:00:00Z",
  "userId": 1
}
```

**Expected**: Status 400 Bad Request
**Test**: ✓ Error message mentions past date not allowed

##### Non-existent User

**Body**:
```json
{
  "title": "Test Task",
  "userId": 999
}
```

**Expected**: Status 400 Bad Request
**Test**: ✓ Error message mentions user not found

##### Non-existent Category

**Body**:
```json
{
  "title": "Test Task",
  "userId": 1,
  "categoryId": 999
}
```

**Expected**: Status 400 Bad Request
**Test**: ✓ Error message mentions category not found

---

### 5. Update a Task

**Purpose**: Test updating task fields

**Method**: `PUT`
**URL**: `/api/tasks/1`
**Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "Critical"
}
```

**Expected**: Status 200 OK

```bash
curl -X PUT "https://localhost:5001/api/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "priority": "Critical"
  }' -k
```

**Test Cases**:
- ✓ Task is updated with new values
- ✓ Fields not provided remain unchanged
- ✓ Response includes updated task

#### Negative Test: Update Non-existent Task

**Method**: `PUT`
**URL**: `/api/tasks/999`
**Expected**: Status 404 Not Found

---

### 6. Update Task Status

**Purpose**: Test status transition workflow

#### Valid Transition: Todo → InProgress

**Method**: `PATCH`
**URL**: `/api/tasks/2/status`
**Body**: `"InProgress"`

```bash
curl -X PATCH "https://localhost:5001/api/tasks/2/status" \
  -H "Content-Type: application/json" \
  -d '"InProgress"' -k
```

**Expected**: Status 200, Task status updated

**Test Cases**:
- ✓ Status changed to InProgress
- ✓ CompletedAt is still null

#### Valid Transition: InProgress → Done

**Method**: `PATCH`
**URL**: `/api/tasks/2/status`
**Body**: `"Done"`

**Expected**: Status 200

**Test Cases**:
- ✓ Status changed to Done
- ✓ CompletedAt is set to current time

#### Invalid Transition: Todo → Done

**Method**: `PATCH`
**URL**: `/api/tasks/3/status` (assuming task 3 is Todo)
**Body**: `"Done"`

**Expected**: Status 400 Bad Request

**Test Cases**:
- ✓ Returns 400 error
- ✓ Error message explains invalid transition

---

### 7. Delete a Task

**Purpose**: Test task deletion

**Method**: `DELETE`
**URL**: `/api/tasks/3`
**Expected**: Status 204 No Content

```bash
curl -X DELETE "https://localhost:5001/api/tasks/3" -k
```

**Test Cases**:
- ✓ Returns 204 No Content
- ✓ Subsequent GET request returns 404

#### Negative Test: Delete Non-existent Task

**Method**: `DELETE`
**URL**: `/api/tasks/999`
**Expected**: Status 404 Not Found

---

### 8. Get Task Statistics

**Purpose**: Verify statistics calculation

**Method**: `GET`
**URL**: `/api/tasks/statistics/1`
**Expected**: Status 200, Statistics object

```bash
curl -X GET "https://localhost:5001/api/tasks/statistics/1" -k
```

**Expected Response**:
```json
{
  "totalTasks": 5,
  "todoTasks": 2,
  "inProgressTasks": 1,
  "completedTasks": 2,
  "overdueTasks": 0
}
```

**Test Cases**:
- ✓ All counts are non-negative
- ✓ totalTasks = sum of other counts (excluding overdue which can overlap)
- ✓ Statistics match actual task data

---

### 9. Get Overdue Tasks

**Purpose**: Test overdue task detection

**Method**: `GET`
**URL**: `/api/tasks/overdue`
**Expected**: Status 200, Array of overdue tasks

**Test Cases**:
- ✓ Only tasks with dueDate < today are returned
- ✓ Completed tasks are excluded
- ✓ Can filter by userId

---

### 10. Complete Workflow Test

**Purpose**: Test entire task lifecycle

**Steps**:

1. **Create a task**
   - POST `/api/tasks` with valid data
   - Verify status 201 and task ID

2. **Retrieve the task**
   - GET `/api/tasks/{id}`
   - Verify status is "Todo"

3. **Update task details**
   - PUT `/api/tasks/{id}` with new title
   - Verify changes applied

4. **Start working (status → InProgress)**
   - PATCH `/api/tasks/{id}/status` with "InProgress"
   - Verify status changed

5. **Complete task (status → Done)**
   - PATCH `/api/tasks/{id}/status` with "Done"
   - Verify completedAt is set

6. **Check statistics**
   - GET `/api/tasks/statistics/{userId}`
   - Verify completed count increased

7. **Delete the task**
   - DELETE `/api/tasks/{id}`
   - Verify 204 response

8. **Confirm deletion**
   - GET `/api/tasks/{id}`
   - Verify 404 response

---

## Testing Tools

### 1. Swagger UI
- Navigate to `https://localhost:5001`
- Click "Try it out" on any endpoint
- Fill in parameters and execute
- View responses

### 2. Postman
1. Create a new collection "Task Manager API"
2. Add requests for each endpoint
3. Use environment variables for base URL
4. Create test scripts for assertions

### 3. curl
- Use the command-line examples provided above
- Add `-v` flag for verbose output
- Use `-k` to skip SSL verification in development

### 4. VS Code Thunder Client
1. Install Thunder Client extension
2. Create requests similar to Postman
3. Save requests for reuse

---

## Test Checklist

### Functional Tests
- [ ] Get all tasks works
- [ ] Filtering by user works
- [ ] Filtering by status works
- [ ] Get single task works
- [ ] Create task with valid data works
- [ ] Update task works
- [ ] Delete task works
- [ ] Status transitions work correctly

### Validation Tests
- [ ] Empty title rejected
- [ ] Long title rejected
- [ ] Past due date rejected
- [ ] Invalid user ID rejected
- [ ] Invalid category ID rejected
- [ ] Invalid status transitions rejected

### Edge Cases
- [ ] Non-existent task returns 404
- [ ] Non-existent user returns 400
- [ ] Completed tasks have completedAt set
- [ ] Statistics are accurate
- [ ] Overdue detection works

### Error Handling
- [ ] 400 errors have meaningful messages
- [ ] 404 errors have appropriate messages
- [ ] 500 errors are logged (check console)

---

## Expected Results Summary

| Scenario | Expected Status | Notes |
|----------|----------------|-------|
| Get all tasks | 200 OK | Returns array |
| Get task by ID | 200 OK | Returns single task |
| Get non-existent task | 404 Not Found | Error message |
| Create valid task | 201 Created | Location header set |
| Create invalid task | 400 Bad Request | Validation error |
| Update existing task | 200 OK | Returns updated task |
| Update non-existent task | 404 Not Found | Error message |
| Valid status transition | 200 OK | Status updated |
| Invalid status transition | 400 Bad Request | Error message |
| Delete existing task | 204 No Content | No body |
| Delete non-existent task | 404 Not Found | Error message |

---

## Automation Opportunity

After completing manual testing, consider:
- Converting these scenarios to automated integration tests
- Creating Postman collections with test scripts
- Building a test suite with xUnit
- Implementing continuous testing in CI/CD

This manual testing experience will help you understand what to automate and why automation is valuable!
