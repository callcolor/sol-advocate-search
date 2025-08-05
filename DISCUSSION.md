# Discussion

## Instructions

Configure the database and seed with advocates.
Open PR(s) against 'main' branch.

## Tasks

1 Improve the design UI/UX to make the experience better for prospective patients.c
2 Improve the design UI/UX to make the experience better for prospective patients. We value design heavily at Solace so feel free to flex your skills in this area. The repo is set up with tailwind but feel free to use any styling framework you’d like.
3 Consider both frontend and backend performance improvements. Assume we have a database of hundreds of thousands of advocates we need to search through.

## Must have for MVP:

Move filtering to back-end API/database layer. We will have way too much data to filter on the front-end.
Add indexes to database columns used in sorting, filtering.
CI/CD pipeline is missing. We can't deploy!

## User experience improvements:

Filtering yearsOfExperience should be >= not .includes(), should have its own UI input.
Should yearsOfExperience be a default sort? Especially when location is not available?

Do users want advocates familiar with their area?

- If so, should we sort by distance from the provided location rather than filtering on city/state?
- Should we ask the user for location permissions to pre-fill location data?

Should the results list be a table or card view?  
Should we should try to avoid choice paralysis by highlighting the best matches?

## Maintainability improvements:

No tests!

- Implement jest testing library for unit tests.
- Implement testcontainers for DB integration tests.

Use advocates schema as a base to generate Typescript types.

- Implement in api/advocates/route.

Implement advocate API response type for front-end application. "...assume API server is a separate application."

Add linter and typecheck to CI/CD (PR) checks.

Should we separate advocate search component from home page component?
Should we separate advocate data component from advocate search component? Suggest useAdvocates() hook?

Fix console errors.

## Process

Discuss using feature branches instead of merging everything to main?
