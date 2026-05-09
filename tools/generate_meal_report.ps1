param(
  [string]$TemplatePath = "C:\Users\lenovo\Downloads\Shree_Internship_Report.docx",
  [string]$OutputPath = "Meal_Management_System_Internship_Report.docx"
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectTitle = "Meal Management System"
$studentName = "Shree Sharma"
$enrollmentNo = "0801CA231137"
$guideName = "Dr. Puja Gupta"
$coGuideName = "Mr. Pritam Khatarkar"
$session = "2024-2025"

$content = @(
  $projectTitle,
  $session,
  "A Dissertation Submitted to",
  "Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal towards the partial fulfillment of the degree of",
  "Master of Computer Applications",
  "Supervised by: Submitted by:",
  "$guideName $studentName",
  "Assistant Professor $enrollmentNo",
  "Information Technology Computer Technology and Applications",
  "DEPARTMENT OF COMPUTER TECHNOLOGY AND APPLICATIONS",
  "SHRI G. S. INSTITUTE OF TECHNOLOGY AND SCIENCE, INDORE (M.P.)",
  $session,
  "RECOMMENDATION",
  "We are pleased to recommend that the dissertation work entitled $projectTitle submitted by $studentName may be accepted in partial fulfillment of the postgraduate degree of Master of Computer Applications of Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal (M.P.) during the session $session.",
  ".",
  "Dr. Puja Gupta Dr. Sunita Varma",
  "Assistant Professor Head Of Department",
  "Information Technology Computer Technology and Applications",
  "$coGuideName Assistant Professor Information Technology",
  "Dean Academic: Dr. Lalit Purohit",
  "SHRI G. S. INSTITUTE OF TECHNOLOGY AND SCIENCE, INDORE (M.P.)",
  "CERTIFICATE",
  "This is to certify that the dissertation entitled $projectTitle submitted by $studentName is accepted in partial fulfillment of the degree of Department of Computer Technology and Applications of Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal during the session $session.",
  "Internal Examiner External Examiner",
  "Date: Date:",
  "DECLARATION",
  "I, $studentName, Department of Computer Technology and Applications, declare that the dissertation $projectTitle is my own work conducted under the supervision of $guideName, Assistant Professor, Information Technology and $coGuideName, Assistant Professor, Information Technology, Shri G. S. Institute of Technology and Science, Indore (M.P.).",
  "I further declare that to the best of my knowledge, this dissertation work does not contain any part of any work which has been submitted for the award of any degree or any other work either in this University or in any other University/website without proper citation.",
  "Signature of the candidate:",
  "Name of the candidate: $studentName Enrollment No.: $enrollmentNo",
  "ACKNOWLEDGEMENT",
  "I would like to express my sincere gratitude to my guide $guideName for her valuable guidance, continuous support, and encouragement throughout the development of the $projectTitle project. I also thank $coGuideName, the Head of the Department Dr. Sunita Varma, Academic Dean Dr. Lalit Purohit, project coordinators, faculty members, and the technical staff of the Department of Computer Technology and Applications for their assistance and motivation. Their support helped me understand practical software development and complete this project successfully.",
  "Signature $studentName",
  $enrollmentNo,
  "ABSTRACT",
  "This internship report presents the design and development of a Meal Management System, a web-based application created to simplify employee meal registration, meal selection, food management, daily plate counting, and revenue tracking. The project is built using React.js on the frontend and connected to REST APIs hosted on Azure. The system supports two major roles: employee users and administrators. Employees can register, log in, choose meal types, select food items, add meals, and view their personal meal history. Administrators can manage employees, meal types, foods, and complete meal history with filters. The application uses React Router for navigation, local storage for session details, fetch-based API communication, react-toastify for user feedback, react-datepicker for date filtering, and a responsive dark themed user interface. The report explains the requirement analysis, system design, implementation, testing process, tools used, challenges faced, and learning outcomes gained while developing the project.",
  "Table of Contents",
  "Chapter 1",
  "INTRODUCTION",
  "Overview:-",
  "The Meal Management System is a frontend web application designed to manage daily meals in an organization or institutional environment. In many workplaces, meal records are maintained manually through registers, spreadsheets, or informal messages. This creates confusion in counting plates, calculating the total amount, and tracking individual employee history. The proposed system digitizes this process by providing separate dashboards for employees and administrators. The employee dashboard allows users to select available meal types and food items, while the admin dashboard provides employee management, meal type management, food management, total plates, revenue, and complete history features.",
  "The project was developed using React.js with reusable pages and components. It communicates with a backend API hosted at https://meetali-api-001.azurewebsites.net. The frontend contains pages for registration, login, employee dashboard, admin dashboard, food manager, meal type manager, global meal history, and personal meal history. A loader component and toast notifications improve user experience during API calls.",
  "Objectives:-",
  "To design and develop a web-based meal management application using React.js.",
  "To provide separate workflows for employees and administrators.",
  "To allow employees to register, log in, select meals, choose food items, and view personal history.",
  "To allow administrators to manage employees, foods, meal types, meal history, daily plates, and total revenue.",
  "To reduce manual record keeping and improve accuracy in meal count and billing.",
  "To build a responsive and user-friendly interface connected with live REST APIs.",
  "Problem statement:-",
  "Organizations that provide daily meals often face difficulty in maintaining accurate meal records. Manual systems are slow, repetitive, and prone to errors. Employees may not have a clear way to view their own meal history, while administrators may struggle to calculate daily plate count, food selection details, and total amount. The Meal Management System solves these problems by offering a centralized digital platform where meal data can be added, viewed, filtered, and managed in real time.",
  "Need of the system:-",
  "A computerized meal system is required to avoid duplicate entries, simplify daily meal selection, calculate total plates automatically, maintain employee-wise history, and give administrators an organized dashboard for operational decisions.",
  "Chapter 2",
  "LITERATURE REVIEW",
  "Meal Management and Canteen Automation",
  "Traditional canteen and meal tracking systems depend on paper registers, token systems, or spreadsheets. These methods work for small groups but become inefficient when the number of employees increases. Digital canteen systems and meal booking platforms improve reliability by allowing users to submit meal requests and allowing administrators to monitor consumption and cost.",
  "Existing systems generally provide features such as user login, menu management, order placement, billing, and reports. However, many systems are either too complex for a simple workplace meal process or do not provide a clean separation between admin and employee workflows. The proposed project focuses on practical meal entry, food selection, employee management, and history tracking.",
  "Web-Based Management Systems",
  "Modern web applications are widely used for internal management because they are easy to access, simple to update, and can work across different devices. React.js is a popular library for building dynamic user interfaces because it supports component-based development, state management through hooks, and fast rendering. React Router helps divide the application into separate screens, improving usability and maintainability.",
  "REST API Integration",
  "REST APIs are commonly used to connect frontend applications with backend services. In this project, API calls are used for authentication, employee management, meal type management, food management, adding meals, viewing history, and calculating totals. The fetch API is used to send GET, POST, PUT, and DELETE requests, while JSON is used as the data exchange format.",
  "User Interface and Feedback",
  "Good user experience is important in operational applications. This project uses toast messages for success, warning, and error feedback. It also uses a loader overlay during data loading. A dark theme with green highlights is applied through CSS to give a consistent dashboard experience.",
  "Chapter 3",
  "SYSTEM DESIGN",
  "System design is the foundation of the Meal Management System. The application is divided into role-based screens and reusable workflows. The design focuses on clarity, simple navigation, API-driven data, and separation of employee and administrator responsibilities.",
  "EXISTING SYSTEM",
  "In the existing manual process, employees may communicate meal requirements verbally or through informal records. Administrators need to count plates manually, calculate amounts separately, and maintain employee records in spreadsheets or registers.",
  "Limitations of existing system:-",
  "Manual entry consumes time and increases workload.",
  "Searching old meal records is difficult.",
  "Daily plate count and revenue calculation can be inaccurate.",
  "Employee-wise meal history is not easily available.",
  "Food and meal type changes are hard to manage centrally.",
  "PROPOSED SYSTEM DESIGN",
  "The proposed system provides a React-based frontend connected with backend APIs. It includes authentication, admin dashboard, employee dashboard, food management, meal type management, history management, and personal history modules. Data is fetched from the server and displayed in cards, forms, dropdowns, and tables.",
  "Technology Stack:",
  "Frontend: React.js, JavaScript, HTML, CSS",
  "Routing: React Router DOM",
  "API Communication: Fetch API and JSON",
  "Notifications: React Toastify",
  "Date Filtering: React Datepicker",
  "Session Handling: Browser Local Storage",
  "Deployment/API: Azure hosted backend APIs",
  "Main Modules",
  "Registration Module: Allows new users to create an account using full name, email, and password.",
  "Login Module: Authenticates users and redirects them based on role.",
  "Employee Dashboard: Allows employees to select meal type, choose food items, add meal, view today's plate count, and open personal history.",
  "Admin Dashboard: Displays employee count, today's plates, total revenue, employee list, search, add, edit, and delete operations.",
  "Food Manager: Allows administrators to add, update, delete, and list food items linked with meal types.",
  "Meal Type Manager: Allows administrators to add, update, delete, and list meal types with fixed price.",
  "History Module: Allows administrators to filter meal records by date range, employee name, and meal type.",
  "My History Module: Allows employees to view only their own meal records and total amount.",
  "System Flow:",
  "User opens the application and registers or logs in.",
  "Login API validates credentials and returns user role.",
  "If role is Admin, the user is redirected to the admin dashboard.",
  "If role is employee, the user is redirected to the employee dashboard.",
  "Employee selects meal type and food items and submits meal entry.",
  "Admin manages employees, foods, meal types, and history from separate pages.",
  "Figure 3.1: System Flow Diagram",
  "Figure 3.2: Admin Use Case Diagram",
  "Figure 3.3: Employee Use Case Diagram",
  "Database/API Entities",
  "Employee: employeeId, fullName, email, role.",
  "MealType: mealTypeId, mealName, fixedPrice.",
  "Food: foodId, foodName, mealTypeId.",
  "Meal: employeeId, mealTypeId, foodIds, mealDate, fixedPrice.",
  "Chapter 4",
  "IMPLEMENTATION AND TESTING",
  "The implementation of the Meal Management System was completed through multiple modules. Each module was connected with backend APIs and tested through browser interaction. The frontend project follows the Create React App structure with source files placed inside the src directory.",
  "Development Phases",
  "Phase 1: Project Setup",
  "The React project was prepared using Create React App. Dependencies such as react-router-dom, react-toastify, react-datepicker, and axios were included. The src folder contains App.js, App.css, index.js, reusable Loader component, and all page components.",
  "Phase 2: Authentication",
  "The Register page sends user details to /api/Auth/Register. The Login page sends email and password to /api/Auth/login. After successful login, the token and employee details are stored in localStorage. The role returned by the API decides whether the user moves to /admindashboard or /dashboard.",
  "Phase 3: Employee Dashboard",
  "The Dashboard page loads meal types from /api/MealType/All and food items from /api/Food/ByMeal/{mealTypeId}. Employees can select multiple food items and submit them through /api/Meal/AddBulk. The page also shows today's plates using /api/Meal/TodayTotalPlates.",
  "Phase 4: Admin Dashboard",
  "The AdminDashBoard page loads all employees through /api/Employee/All and statistics through /api/Meal/TodayTotalPlates and /api/Meal/TodayTotalAmount. It provides search, add employee, edit employee, delete employee, and navigation to history, food, and meal type pages.",
  "Phase 5: Food and Meal Type Management",
  "The FoodManager page handles food CRUD operations using /api/Food/All, /api/Food/Add, /api/Food/Update/{id}, and /api/Food/Delete/{id}. The MealTypeManager page handles meal type CRUD operations using /api/MealType/All, /api/MealType/Add, /api/MealType/Update/{id}, and /api/MealType/Delete/{id}.",
  "Phase 6: History and Reports",
  "The History page allows administrators to filter records using from date, to date, name, and meal type. It calls /api/Meal/History with query parameters and displays records with total amount. The MyHistory page calls /api/Meal/MyHistory/{employeeId} and shows employee-specific meal data.",
  "Packages and Tools Used Frontend:",
  "React.js for component-based UI development.",
  "React Router DOM for page navigation.",
  "React Toastify for notifications.",
  "React Datepicker for date range selection.",
  "Fetch API for backend communication.",
  "CSS for responsive dark themed layout.",
  "Testing Tools:",
  "Browser testing for registration, login, navigation, form submissions, and table displays.",
  "Chrome DevTools for checking console logs, network requests, API responses, and layout behavior.",
  "Manual test cases for employee dashboard, admin dashboard, food manager, meal type manager, history filters, and logout.",
  "Testing Process",
  "Registration Testing: Verified required fields and successful registration flow.",
  "Login Testing: Verified empty field validation, invalid credential message, successful login, and role-based navigation.",
  "Dashboard Testing: Verified meal type loading, food loading, food selection, add meal request, and plate count refresh.",
  "Admin Testing: Verified employee add, update, delete, search, and statistics display.",
  "Food Testing: Verified add, update, delete, and listing of food items.",
  "Meal Type Testing: Verified add, update, delete, and price display.",
  "History Testing: Verified date filter, name search, meal type filter, total amount, and delete meal operation.",
  "UI Testing: Verified responsive layout, loader visibility, toast messages, hover effects, and table readability.",
  "Challenges Faced During Implementation",
  "Handling asynchronous API loading across multiple pages.",
  "Maintaining role-based navigation after login.",
  "Clearing and updating localStorage during login and logout.",
  "Refreshing data after add, update, and delete operations.",
  "Managing dependent dropdowns for meal types and foods.",
  "Displaying history data with filters and total amount.",
  "Chapter 5",
  "Conclusion",
  "Conclusion",
  "The Meal Management System successfully provides a digital solution for managing daily employee meals. It reduces manual work, improves record accuracy, and gives both employees and administrators clear access to the information they need. The project demonstrates practical use of React.js, REST API integration, routing, state management, form handling, notifications, and responsive dashboard design.",
  "Key Takeaways",
  "Learned how to build a complete frontend application using React.js.",
  "Understood role-based navigation and session handling with localStorage.",
  "Gained experience in connecting frontend screens with live REST APIs.",
  "Improved knowledge of CRUD operations for employees, foods, and meal types.",
  "Learned to display operational data using cards, filters, tables, and history views.",
  "Understood the importance of validation, loading states, and user feedback.",
  "Contribution to the Project",
  "Developed registration and login interfaces.",
  "Built employee dashboard for meal selection and personal history.",
  "Built admin dashboard for employees, statistics, and navigation.",
  "Implemented food management and meal type management screens.",
  "Implemented history filters and total amount display.",
  "Designed a consistent dark themed user interface with responsive CSS.",
  "Future Scope",
  "Add downloadable PDF or Excel reports for meal history.",
  "Add stronger authentication guards for protected routes.",
  "Add charts for daily, weekly, and monthly meal consumption.",
  "Add payment status tracking for employees.",
  "Add admin roles and permissions.",
  "Add automated tests for important components and API workflows.",
  "Final Reflection",
  "This project was a valuable practical learning experience because it combined frontend development with real operational requirements. It improved my understanding of React components, hooks, API integration, routing, UI design, debugging, and testing. The Meal Management System can be further extended into a complete canteen or organization meal tracking product.",
  "APPENDIX",
  "APPENDIX",
  "- Screenshots of registration, login, employee dashboard, admin dashboard, food manager, meal type manager, history, and my history pages. - API endpoint list. - Sample test cases. - Future enhancement notes.",
  "A. Registration Page Screenshot",
  "The registration page collects email, full name, and password from new users and sends the data to the backend registration API.",
  "Figure 1: Registration Page",
  "B. Login Page Screenshot",
  "The login page validates email and password, stores token and employee details, and redirects the user based on role.",
  "Figure 2: Login Page",
  "C. Employee Dashboard Screenshot",
  "The employee dashboard displays the user's name, today's plates, meal type dropdown, food items grid, add meal button, view history button, and logout option.",
  "Figure 3: Employee Dashboard",
  "D. Admin Dashboard Screenshot",
  "The admin dashboard displays total employees, today's plates, total revenue, employee management form, search feature, and navigation to history, food, and meal type pages.",
  "Figure 4: Admin Dashboard",
  "E. Food Manager Screenshot",
  "The food manager page allows administrators to add, update, delete, and list food items under selected meal types.",
  "Figure 5: Food Manager",
  "F. Meal Type Manager Screenshot",
  "The meal type manager page allows administrators to create meal categories and define fixed prices.",
  "Figure 6: Meal Type Manager",
  "G. History Screenshot",
  "The history page allows administrators to filter meal records by date range, name, and meal type and view the total amount.",
  "Figure 7: Meal History",
  "H. My History Screenshot",
  "The my history page shows employee-specific meal records, selected food items, date, price, and total amount.",
  "Figure 8: My Meal History",
  "Sample API Endpoints",
  "POST /api/Auth/Register",
  "POST /api/Auth/login",
  "GET /api/Employee/All",
  "POST /api/Employee/Add",
  "PUT /api/Employee/Update/{id}",
  "DELETE /api/Employee/{id}",
  "GET /api/MealType/All",
  "POST /api/MealType/Add",
  "PUT /api/MealType/Update/{id}",
  "DELETE /api/MealType/Delete/{id}",
  "GET /api/Food/All",
  "GET /api/Food/ByMeal/{mealTypeId}",
  "POST /api/Food/Add",
  "PUT /api/Food/Update/{id}",
  "DELETE /api/Food/Delete/{id}",
  "POST /api/Meal/AddBulk",
  "GET /api/Meal/TodayTotalPlates",
  "GET /api/Meal/TodayTotalAmount",
  "GET /api/Meal/History",
  "GET /api/Meal/MyHistory/{employeeId}",
  "DELETE /api/Meal/Delete",
  "REFERENCES",
  "React.js Official Documentation.",
  "React Router Documentation.",
  "React Toastify Documentation.",
  "React Datepicker Documentation.",
  "Create React App Documentation.",
  "Microsoft Azure App Service Documentation.",
  "REST API design references and browser developer tools documentation."
)

$absoluteOutput = if ([System.IO.Path]::IsPathRooted($OutputPath)) {
  $OutputPath
} else {
  Join-Path (Get-Location) $OutputPath
}

$templateStream = [System.IO.File]::Open(
  $TemplatePath,
  [System.IO.FileMode]::Open,
  [System.IO.FileAccess]::Read,
  [System.IO.FileShare]::ReadWrite
)

try {
  $outputStream = [System.IO.File]::Create($absoluteOutput)
  try {
    $templateStream.CopyTo($outputStream)
  } finally {
    $outputStream.Dispose()
  }
} finally {
  $templateStream.Dispose()
}

$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("meal-report-" + [guid]::NewGuid().ToString("N"))
[System.IO.Directory]::CreateDirectory($tempDir) | Out-Null

try {
  [System.IO.Compression.ZipFile]::ExtractToDirectory($absoluteOutput, $tempDir)

  $documentPath = Join-Path $tempDir "word\document.xml"
  [xml]$xml = Get-Content -LiteralPath $documentPath -Raw
  $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
  $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

  $paragraphs = $xml.SelectNodes("//w:body/w:p", $ns)
  $contentIndex = 0

  $imageLikeNodes = @()
  foreach ($node in $xml.SelectNodes("//*")) {
    if ($node.LocalName -in @("drawing", "pict", "object")) {
      $imageLikeNodes += $node
    }
  }

  foreach ($node in $imageLikeNodes) {
    if ($node.ParentNode -ne $null) {
      [void]$node.ParentNode.RemoveChild($node)
    }
  }

  foreach ($paragraph in $paragraphs) {
    $textNodes = $paragraph.SelectNodes(".//w:t", $ns)
    if ($textNodes.Count -eq 0) {
      continue
    }

    $currentText = (($textNodes | ForEach-Object { $_.'#text' }) -join "").Trim()
    if ($currentText.Length -eq 0) {
      continue
    }

    $replacement = ""
    if ($contentIndex -lt $content.Count) {
      $replacement = $content[$contentIndex]
    }

    $textNodes[0].InnerText = $replacement
    for ($i = 1; $i -lt $textNodes.Count; $i++) {
      $textNodes[$i].InnerText = ""
    }

    $contentIndex++
  }

  $settings = New-Object System.Xml.XmlWriterSettings
  $settings.Encoding = New-Object System.Text.UTF8Encoding($false)
  $settings.Indent = $false
  $writer = [System.Xml.XmlWriter]::Create($documentPath, $settings)
  try {
    $xml.Save($writer)
  } finally {
    $writer.Close()
  }

  Remove-Item -LiteralPath $absoluteOutput -Force

  $zipStream = [System.IO.File]::Create($absoluteOutput)
  $newZip = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    Get-ChildItem -LiteralPath $tempDir -Recurse -File | ForEach-Object {
      $relativePath = $_.FullName.Substring($tempDir.Length).TrimStart("\", "/")
      $entryName = $relativePath.Replace("\", "/")
      $entry = $newZip.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
      $entryStream = $entry.Open()
      $sourceStream = [System.IO.File]::OpenRead($_.FullName)
      try {
        $sourceStream.CopyTo($entryStream)
      } finally {
        $sourceStream.Dispose()
        $entryStream.Dispose()
      }
    }
  } finally {
    $newZip.Dispose()
    $zipStream.Dispose()
  }

  Write-Output "Created report: $absoluteOutput"
  Write-Output "Template paragraphs replaced: $contentIndex"
  Write-Output "Report content paragraphs: $($content.Count)"
} finally {
  if (Test-Path -LiteralPath $tempDir) {
    Remove-Item -LiteralPath $tempDir -Recurse -Force
  }
}
