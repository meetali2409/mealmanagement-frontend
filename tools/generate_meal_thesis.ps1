$ErrorActionPreference = "Stop"

$outputPath = Join-Path (Get-Location) "Meal_Management_System_Thesis.docx"

$projectTitle = "Meal Management System"
$studentName = "Shree Sharma"
$enrollmentNo = "0801CA231137"
$guideName = "Dr. Puja Gupta"
$coGuideName = "Mr. Pritam Khatarkar"
$session = "2024-2025"
$department = "DEPARTMENT OF COMPUTER TECHNOLOGY AND APPLICATIONS"
$institute = "SHRI G.S. INSTITUTE OF TECHNOLOGY AND SCIENCE, INDORE (M.P.)"
$university = "Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal"

$wdAlignParagraphLeft = 0
$wdAlignParagraphCenter = 1
$wdAlignParagraphRight = 2
$wdAlignParagraphJustify = 3
$wdPageBreak = 7
$wdSectionBreakNextPage = 2
$wdFieldPage = 33
$wdFormatDocumentDefault = 16
$wdHeaderFooterPrimary = 1
$wdPageNumberStyleLowercaseRoman = 2
$wdPageNumberStyleArabic = 0
$wdNumberGalleryBullet = 1
$wdWord9TableBehavior = 1
$wdAutoFitWindow = 2

function Set-BaseStyle {
  param($doc)
  $normal = $doc.Styles.Item("Normal")
  $normal.Font.Name = "Times New Roman"
  $normal.Font.Size = 12
  $normal.ParagraphFormat.LineSpacingRule = 1
  $normal.ParagraphFormat.LineSpacing = 18
  $normal.ParagraphFormat.Alignment = $wdAlignParagraphJustify
  $normal.ParagraphFormat.SpaceAfter = 6
}

function Add-Para {
  param(
    $doc,
    [string]$text,
    [int]$align = $wdAlignParagraphJustify,
    [int]$size = 12,
    [bool]$bold = $false,
    [bool]$italic = $false
  )
  $p = $doc.Content.Paragraphs.Add()
  $p.Range.Text = $text
  $p.Range.Font.Name = "Times New Roman"
  $p.Range.Font.Size = $size
  $p.Range.Font.Bold = [int]$bold
  $p.Range.Font.Italic = [int]$italic
  $p.Range.ParagraphFormat.Alignment = $align
  $p.Range.ParagraphFormat.LineSpacingRule = 1
  $p.Range.ParagraphFormat.LineSpacing = 18
  $p.Range.ParagraphFormat.SpaceAfter = 6
  $p.Range.InsertParagraphAfter()
}

function Add-Heading {
  param($doc, [string]$text, [int]$level = 1)
  $p = $doc.Content.Paragraphs.Add()
  $p.Range.Text = $text
  $p.Range.Style = "Heading $level"
  $p.Range.Font.Name = "Times New Roman"
  $p.Range.Font.Size = 14
  $p.Range.Font.Bold = 1
  $p.Range.ParagraphFormat.Alignment = if ($level -eq 1) { $wdAlignParagraphCenter } else { $wdAlignParagraphLeft }
  $p.Range.ParagraphFormat.LineSpacingRule = 1
  $p.Range.ParagraphFormat.LineSpacing = 18
  $p.Range.ParagraphFormat.SpaceBefore = if ($level -eq 1) { 12 } else { 8 }
  $p.Range.ParagraphFormat.SpaceAfter = 8
  $p.Range.InsertParagraphAfter()
}

function Add-Bullets {
  param($doc, [string[]]$items)
  foreach ($item in $items) {
    $p = $doc.Content.Paragraphs.Add()
    $p.Range.Text = $item
    $p.Range.Font.Name = "Times New Roman"
    $p.Range.Font.Size = 12
    $p.Range.ParagraphFormat.Alignment = $wdAlignParagraphJustify
    $p.Range.ListFormat.ApplyBulletDefault()
    $p.Range.InsertParagraphAfter()
  }
  $doc.Content.Paragraphs.Last.Range.ListFormat.RemoveNumbers()
}

function Add-Code {
  param($doc, [string]$text)
  $p = $doc.Content.Paragraphs.Add()
  $p.Range.Text = $text
  $p.Range.Font.Name = "Courier New"
  $p.Range.Font.Size = 10
  $p.Range.ParagraphFormat.Alignment = $wdAlignParagraphLeft
  $p.Range.ParagraphFormat.LineSpacingRule = 0
  $p.Range.ParagraphFormat.SpaceAfter = 8
  $p.Range.InsertParagraphAfter()
}

function Add-Table {
  param($doc, [string[]]$headers, [object[]]$rows)
  $range = $doc.Content
  $range.Collapse(0)
  $table = $doc.Tables.Add($range, $rows.Count + 1, $headers.Count, $wdWord9TableBehavior, $wdAutoFitWindow)
  $table.Range.Font.Name = "Times New Roman"
  $table.Range.Font.Size = 10
  for ($c = 0; $c -lt $headers.Count; $c++) {
    $table.Cell(1, $c + 1).Range.Text = $headers[$c]
    $table.Cell(1, $c + 1).Range.Font.Bold = 1
  }
  for ($r = 0; $r -lt $rows.Count; $r++) {
    for ($c = 0; $c -lt $headers.Count; $c++) {
      $table.Cell($r + 2, $c + 1).Range.Text = [string]$rows[$r][$c]
    }
  }
  $table.Borders.Enable = 1
  $doc.Content.InsertParagraphAfter()
}

function Page-Break {
  param($doc)
  $range = $doc.Content
  $range.Collapse(0)
  $range.InsertBreak($wdPageBreak)
}

function Section-Break {
  param($doc)
  $range = $doc.Content
  $range.Collapse(0)
  $range.InsertBreak($wdSectionBreakNextPage)
}

function Configure-Section {
  param($section, [int]$numberStyle, [bool]$restart = $true)
  $section.PageSetup.TopMargin = 72
  $section.PageSetup.BottomMargin = 72
  $section.PageSetup.LeftMargin = 72
  $section.PageSetup.RightMargin = 72
  $footer = $section.Footers.Item($wdHeaderFooterPrimary)
  $footer.LinkToPrevious = $false
  $footer.Range.Text = ""
  $footer.Range.Font.Name = "Times New Roman"
  $footer.Range.Font.Size = 10
  $footer.Range.ParagraphFormat.Alignment = $wdAlignParagraphCenter
  $footer.PageNumbers.NumberStyle = $numberStyle
  $footer.PageNumbers.RestartNumberingAtSection = $restart
  $footer.PageNumbers.StartingNumber = 1
  [void]$footer.PageNumbers.Add(1, $true)
}

function Add-Footer-Labels {
  param($section)
  $footer = $section.Footers.Item($wdHeaderFooterPrimary)
  $footer.LinkToPrevious = $false
  $footer.Range.Paragraphs.Add() | Out-Null
  $footer.Range.InsertAfter("Computer Technology & Applications")
  $footer.Range.InsertAfter("`t`t$institute")
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false

try {
  $doc = $word.Documents.Add()
  Set-BaseStyle $doc
  foreach ($section in $doc.Sections) {
    Configure-Section $section $wdPageNumberStyleLowercaseRoman $true
  }

  Add-Para $doc $projectTitle $wdAlignParagraphCenter 20 $true
  Add-Para $doc "/" $wdAlignParagraphCenter 18 $true
  Add-Para $doc $session $wdAlignParagraphCenter 14 $true
  Add-Para $doc "A Dissertation Submitted to" $wdAlignParagraphCenter 14 $true
  Add-Para $doc "$university towards the partial fulfillment of the degree of" $wdAlignParagraphCenter 12
  Add-Para $doc "Master of Computer Applications" $wdAlignParagraphCenter 14 $true
  Add-Para $doc "Supervised by:                                      Submitted by:" $wdAlignParagraphCenter 12 $true
  Add-Para $doc "$guideName                                      $studentName" $wdAlignParagraphCenter 12
  Add-Para $doc "Assistant Professor                              $enrollmentNo" $wdAlignParagraphCenter 12
  Add-Para $doc "Information Technology                         Computer Technology and Applications" $wdAlignParagraphCenter 12
  Add-Para $doc $department $wdAlignParagraphCenter 14 $true
  Add-Para $doc $institute $wdAlignParagraphCenter 14 $true
  Add-Para $doc "A Govt. Aided Autonomous Institute, Affiliated to RGPV, Bhopal" $wdAlignParagraphCenter 12
  Add-Para $doc $session $wdAlignParagraphCenter 12 $true
  Page-Break $doc

  Add-Heading $doc "RECOMMENDATION" 1
  Add-Para $doc "We are pleased to recommend that the dissertation work entitled $projectTitle submitted by $studentName may be accepted in partial fulfillment of the postgraduate degree of Master of Computer Applications of $university (M.P.) during the session $session."
  Add-Para $doc "."
  Add-Para $doc "$guideName                                      Dr. Sunita Verma" $wdAlignParagraphLeft
  Add-Para $doc "Assistant Professor                              Head of Department" $wdAlignParagraphLeft
  Add-Para $doc "Computer Technology and Applications             Computer Technology and Applications" $wdAlignParagraphLeft
  Add-Para $doc "Dean Academic: Dr. Lalit Purohit" $wdAlignParagraphLeft
  Add-Para $doc $institute $wdAlignParagraphCenter 12 $true
  Page-Break $doc

  Add-Heading $doc "CERTIFICATE" 1
  Add-Para $doc "This is to certify that the dissertation entitled $projectTitle submitted by $studentName is accepted in partial fulfillment of the degree of Department of Computer Technology and Applications of $university during the session $session."
  Add-Para $doc "Internal Examiner                                      External Examiner" $wdAlignParagraphLeft
  Add-Para $doc "Date:                                                  Date:" $wdAlignParagraphLeft
  Page-Break $doc

  Add-Heading $doc "DECLARATION" 1
  Add-Para $doc "I, $studentName, Department of Computer Technology and Applications, declare that the dissertation $projectTitle is my own work conducted under the supervision of $guideName, Assistant Professor, Department of Computer Technology and Applications, $institute."
  Add-Para $doc "I further declare that, to the best of my knowledge, this dissertation work does not contain any part of any work that has been submitted for the award of any degree or any other work in this University or any other University/website without proper citation."
  Add-Para $doc "Signature of the candidate :"
  Add-Para $doc "Name of the candidate : $studentName"
  Add-Para $doc "Enrollment No.       : $enrollmentNo"
  Page-Break $doc

  Add-Heading $doc "ACKNOWLEDGEMENT" 1
  Add-Para $doc "I would like to express my sincere gratitude to my guide $guideName for providing valuable direction, professional guidance, and constant encouragement from the beginning of this work. Her support and insight greatly contributed to the successful completion of this project."
  Add-Para $doc "I would also like to thank the Head of the Department Dr. Sunita Verma, Dean Academic Dr. Lalit Purohit, project coordinators, faculty members, and the technical and support staff of the Department of Computer Technology and Applications, Shri G.S. Institute of Technology and Science, Indore. I also extend my sincere appreciation to all those who directly or indirectly contributed to the completion of this thesis."
  Add-Para $doc "Signature" $wdAlignParagraphLeft
  Add-Para $doc "$studentName $enrollmentNo" $wdAlignParagraphLeft
  Page-Break $doc

  Add-Heading $doc "ABSTRACT" 1
  Add-Para $doc "This thesis presents the design and development of the Meal Management System, a web-based application developed to simplify the process of employee meal registration, meal selection, food management, meal type management, daily plate counting, revenue tracking, and meal history maintenance. The system provides separate role-based workflows for employees and administrators. Employees can register, log in, reset passwords through OTP, select meal types, choose food items, add meals, and view their personal meal history. Administrators can manage employees, meal types, food items, complete meal history, daily plate count, and total revenue."
  Add-Para $doc "The frontend is implemented using React.js, React Router DOM, React Toastify, React Datepicker, JavaScript, HTML, and CSS. The system communicates with REST APIs hosted on Azure using JSON-based requests. Local storage is used to maintain token and employee session details. The user interface follows a responsive dark theme with dashboard cards, tables, filters, form validation, loading overlay, and toast-based feedback."
  Add-Para $doc "The thesis covers the complete software development lifecycle, including introduction, literature review, requirement analysis, system design, implementation, testing, results, conclusion, limitations, and future scope. The proposed system reduces manual record keeping, improves accuracy in meal count and billing, and provides a centralized platform for managing organizational meal operations."
  Add-Para $doc "Keywords: Meal Management System, React.js, REST API, Employee Meal Tracking, Admin Dashboard, Food Management, Meal History, Azure API, Web Application."
  Page-Break $doc

  Add-Heading $doc "TABLE OF CONTENTS" 1
  $tocRange = $doc.Content
  $tocRange.Collapse(0)
  [void]$doc.TablesOfContents.Add($tocRange, $true, 1, 3)
  Page-Break $doc

  Add-Heading $doc "LIST OF FIGURES" 1
  Add-Table $doc @("Figure No.", "Title") @(
    @("Figure 3.1", "Use Case Diagram of Meal Management System"),
    @("Figure 3.2", "Data Flow Diagram Level 0"),
    @("Figure 4.1", "System Architecture"),
    @("Figure 4.2", "Meal Entry Flowchart"),
    @("Figure 5.1", "Registration Page"),
    @("Figure 5.2", "Login Page"),
    @("Figure 5.3", "Employee Dashboard"),
    @("Figure 5.4", "Admin Dashboard"),
    @("Figure 5.5", "Food Manager"),
    @("Figure 5.6", "Meal History")
  )
  Page-Break $doc

  Add-Heading $doc "LIST OF TABLES" 1
  Add-Table $doc @("Table No.", "Title") @(
    @("Table 2.1", "Comparative Analysis of Existing Systems"),
    @("Table 3.1", "Functional Requirements"),
    @("Table 3.2", "Non-Functional Requirements"),
    @("Table 3.3", "Software and Hardware Requirements"),
    @("Table 6.1", "Test Cases and Results")
  )
  Page-Break $doc

  Add-Heading $doc "ABBREVIATIONS" 1
  Add-Table $doc @("Abbreviation", "Full Form") @(
    @("API", "Application Programming Interface"),
    @("CRUD", "Create, Read, Update, Delete"),
    @("DOM", "Document Object Model"),
    @("JSON", "JavaScript Object Notation"),
    @("REST", "Representational State Transfer"),
    @("UI", "User Interface"),
    @("UX", "User Experience")
  )

  Section-Break $doc
  Configure-Section $doc.Sections.Item(2) $wdPageNumberStyleArabic $true

  Add-Heading $doc "Chapter 1" 1
  Add-Heading $doc "INTRODUCTION" 1
  Add-Heading $doc "1.1 Introduction" 2
  Add-Para $doc "The Meal Management System is a web-based application created to manage daily employee meals in an organization or institutional environment. Meal tracking is a recurring administrative activity in many offices, hostels, colleges, and companies. When this process is handled manually, the administrator must maintain separate records for employees, meal types, food items, meal dates, plate count, and payable amount. This increases the possibility of duplicate entries, missing records, incorrect totals, and delayed reporting."
  Add-Para $doc "The proposed system provides a centralized digital solution where employees can select their meals and administrators can manage complete meal operations. The frontend application is developed in React.js and communicates with REST APIs hosted on Azure. The system includes registration, login, forgot password, employee dashboard, admin dashboard, food management, meal type management, global history, and personal history modules."
  Add-Heading $doc "1.2 Background of Study" 2
  Add-Para $doc "The growth of web-based management systems has made it possible to digitize routine administrative workflows. Instead of depending on paper registers or spreadsheets, organizations can use a browser-based application to capture data in real time and display meaningful summaries. In a meal management process, daily decisions depend on accurate plate count, employee-wise usage, selected food items, fixed meal prices, and total amount. Therefore, a structured system is required to improve transparency and reduce manual effort."
  Add-Para $doc "React.js is suitable for this type of system because it supports component-based development, reusable pages, state management through hooks, and smooth rendering of dynamic data. REST APIs make it possible to separate frontend and backend responsibilities, while browser local storage allows the frontend to maintain session information after successful authentication."
  Add-Heading $doc "1.3 Problem Statement" 2
  Add-Para $doc "Manual meal record systems are time-consuming and error-prone. Employees may not have a direct interface to submit meal details or view their own history. Administrators may need to collect meal data from informal messages, registers, or spreadsheets and then manually calculate the total number of plates and total amount. Searching records by date, employee name, or meal type becomes difficult when data grows."
  Add-Para $doc "The Meal Management System addresses this problem by providing a role-based web application. Employees can add meal entries and view personal history, while administrators can manage employees, food items, meal types, complete history, and revenue. The system aims to make meal data accurate, searchable, and easier to maintain."
  Add-Heading $doc "1.4 Objectives of the Project" 2
  Add-Bullets $doc @(
    "To develop a React.js based web application for managing organizational meals.",
    "To provide role-based workflows for employees and administrators.",
    "To implement user registration, login, and OTP-based forgot password functionality.",
    "To allow employees to select meal types, choose food items, add meals, and view personal history.",
    "To allow administrators to manage employees, meal types, food items, history, daily plate count, and total revenue.",
    "To connect the frontend with REST APIs using JSON-based requests.",
    "To design a responsive and user-friendly dashboard interface.",
    "To reduce manual record keeping and improve data accuracy."
  )
  Add-Heading $doc "1.5 Scope of the Project" 2
  Add-Para $doc "The project scope includes frontend development for an employee meal tracking system. It covers authentication screens, employee dashboard, admin dashboard, CRUD screens for food and meal types, filtered history view, personal history view, loading indicator, notifications, and responsive styling. The system is useful for small and medium organizations that need a simple internal meal tracking solution."
  Add-Heading $doc "1.6 Need of the System" 2
  Add-Para $doc "The system is needed to reduce dependency on paper registers and manual calculation. It provides real-time access to meal information, simplifies administrator work, allows employee self-service, and improves transparency in meal count and billing. A digital solution also makes future reporting and analytics easier."
  Add-Heading $doc "1.7 Methodology Overview" 2
  Add-Para $doc "The project follows a modular development methodology. First, requirements were studied by identifying employee and admin workflows. Then, frontend routes and pages were planned. API integration was implemented module by module. Manual testing was performed after each feature, including form validation, API response checking, navigation, and UI verification."
  Add-Heading $doc "1.8 Organization of Thesis" 2
  Add-Para $doc "Chapter 1 introduces the project, problem statement, objectives, scope, need, and methodology. Chapter 2 reviews related systems and technologies. Chapter 3 discusses system analysis and requirements. Chapter 4 explains system design. Chapter 5 describes implementation details. Chapter 6 presents testing and results. Chapter 7 concludes the thesis and discusses future scope."

  Page-Break $doc
  Add-Heading $doc "Chapter 2" 1
  Add-Heading $doc "LITERATURE REVIEW" 1
  Add-Heading $doc "2.1 Existing System" 2
  Add-Para $doc "In many organizations, meal management is handled using registers, spreadsheets, tokens, or informal communication channels. These approaches are simple at the beginning but become difficult to maintain as the number of employees and meal records increases. Manual systems do not provide instant history, automated totals, or role-based access."
  Add-Heading $doc "2.2 Related Work" 2
  Add-Para $doc "Canteen automation systems, hostel mess management applications, and employee cafeteria portals are related to this project. Such systems usually include menu management, order placement, billing, user authentication, and reporting. The Meal Management System focuses on a lightweight and practical workflow: employees submit meal entries, administrators manage master data, and records are stored through APIs for history and reporting."
  Add-Heading $doc "2.3 Research Papers Review" 2
  Add-Para $doc "Studies on management information systems show that digitization improves accuracy, traceability, and decision-making. Web-based systems provide centralized access and reduce repetitive administrative work. Research on canteen and cafeteria management systems highlights the importance of user authentication, menu management, automated billing, and report generation."
  Add-Para $doc "Modern frontend libraries such as React.js are frequently used in web-based management systems because they support component reuse, efficient rendering, and maintainable interfaces. REST APIs are also widely used because they allow frontend and backend layers to be developed independently."
  Add-Heading $doc "2.4 Comparative Analysis" 2
  Add-Table $doc @("System Type", "Advantages", "Limitations") @(
    @("Manual Register", "Simple and low cost", "Slow, error-prone, difficult to search"),
    @("Spreadsheet System", "Easy calculation and basic filtering", "No role-based access, manual updates needed"),
    @("Generic Ordering App", "Provides ordering and billing", "May be too complex for employee meal tracking"),
    @("Proposed System", "Role-based, simple, API-driven, history and totals available", "Currently depends on internet and backend API availability")
  )
  Add-Heading $doc "2.5 Limitations of Existing Systems" 2
  Add-Bullets $doc @(
    "Manual systems do not provide instant employee-wise history.",
    "Daily plate count and revenue calculation require extra effort.",
    "Data can be lost or duplicated when maintained on paper.",
    "Food item and meal type updates are not centralized.",
    "Filtering by date, name, or meal type is difficult in informal systems."
  )
  Add-Heading $doc "2.6 Chapter Summary" 2
  Add-Para $doc "The literature review shows that a web-based meal management system can improve accuracy, reduce manual effort, and provide useful administrative visibility. The proposed project uses React.js and REST APIs to create a practical solution for employee meal tracking."

  Page-Break $doc
  Add-Heading $doc "Chapter 3" 1
  Add-Heading $doc "SYSTEM ANALYSIS AND REQUIREMENTS" 1
  Add-Heading $doc "3.1 Requirement Analysis" 2
  Add-Para $doc "Requirement analysis identifies the expected behavior of the system from employee and administrator perspectives. The system must allow users to authenticate, maintain session data, perform meal-related actions, display data from APIs, and provide clear feedback through the interface."
  Add-Heading $doc "3.2 Functional Requirements" 2
  Add-Table $doc @("Requirement", "Description") @(
    @("User Registration", "New users can register using email, full name, and password."),
    @("Login", "Users can log in using email and password."),
    @("Forgot Password", "Users can request OTP and reset password."),
    @("Role-Based Navigation", "Admin users go to admin dashboard and employees go to employee dashboard."),
    @("Meal Entry", "Employees can select meal type and food items and submit meal records."),
    @("Employee Management", "Admin can add, edit, search, and delete employees."),
    @("Food Management", "Admin can add, update, delete, and list food items."),
    @("Meal Type Management", "Admin can add, update, delete, and list meal types with fixed price."),
    @("History Filtering", "Admin can filter meal history by date range, name, and meal type."),
    @("Personal History", "Employees can view their own meal history and total amount.")
  )
  Add-Heading $doc "3.3 Non-Functional Requirements" 2
  Add-Table $doc @("Requirement", "Description") @(
    @("Usability", "Interface should be simple and understandable for employees and admins."),
    @("Responsiveness", "Layout should work on desktop and smaller screens."),
    @("Reliability", "System should display API errors and avoid silent failures."),
    @("Maintainability", "Pages should be divided into clear React components."),
    @("Performance", "Data loading should be efficient and accompanied by loader feedback."),
    @("Security", "Authentication token and employee details should be handled carefully.")
  )
  Add-Heading $doc "3.4 Feasibility Study" 2
  Add-Para $doc "The project is technically feasible because it uses widely available technologies such as React.js, JavaScript, HTML, CSS, and REST APIs. It is economically feasible because it can be developed using open-source frontend tools. Operationally, the system is feasible because employees and administrators can use it through a browser without complex installation."
  Add-Heading $doc "3.5 Software and Hardware Requirements" 2
  Add-Table $doc @("Category", "Requirement") @(
    @("Operating System", "Windows 10/11 or any OS with a modern browser"),
    @("Frontend", "React.js, JavaScript, HTML, CSS"),
    @("Libraries", "react-router-dom, react-toastify, react-datepicker"),
    @("Browser", "Google Chrome, Microsoft Edge, or Mozilla Firefox"),
    @("Code Editor", "Visual Studio Code"),
    @("Backend API", "Azure hosted REST API"),
    @("Hardware", "Minimum 4 GB RAM, dual-core processor, internet connection")
  )
  Add-Heading $doc "3.6 Use Case Diagram" 2
  Add-Para $doc "Figure 3.1: Use Case Diagram of Meal Management System"
  Add-Para $doc "Actors: Employee and Administrator. Employee use cases include register, login, forgot password, select meal, add meal, view personal history, and logout. Administrator use cases include login, manage employees, manage foods, manage meal types, view history, delete meal records, view statistics, and logout."
  Add-Heading $doc "3.7 DFD / ER Diagram" 2
  Add-Para $doc "Figure 3.2: Data Flow Diagram Level 0"
  Add-Para $doc "The user interacts with the React frontend. The frontend sends requests to authentication, employee, meal type, food, and meal APIs. The backend stores and retrieves data from the database and returns JSON responses to the frontend."
  Add-Para $doc "Main entities include Employee, MealType, Food, and Meal. Employee is connected with Meal through employeeId. MealType is connected with Food through mealTypeId. Meal records store selected food items, meal date, and price-related details."

  Page-Break $doc
  Add-Heading $doc "Chapter 4" 1
  Add-Heading $doc "SYSTEM DESIGN" 1
  Add-Heading $doc "4.1 Architecture Design" 2
  Add-Para $doc "The Meal Management System follows a client-server architecture. The React frontend acts as the client and communicates with backend REST APIs hosted on Azure. The frontend is responsible for routing, forms, validation checks, API calls, state updates, and displaying responses. The backend API is responsible for business logic, authentication, data persistence, and returning structured JSON data."
  Add-Para $doc "Figure 4.1: System Architecture"
  Add-Heading $doc "4.2 Database Design" 2
  Add-Para $doc "The frontend interacts with backend entities through API endpoints. Although the database implementation is on the backend side, the frontend uses entity fields such as employeeId, fullName, email, role, mealTypeId, mealName, fixedPrice, foodId, foodName, mealDate, foodNames, and totalAmount."
  Add-Table $doc @("Entity", "Important Fields", "Purpose") @(
    @("Employee", "employeeId, fullName, email, role", "Stores user and role information"),
    @("MealType", "mealTypeId, mealName, fixedPrice", "Stores meal categories and price"),
    @("Food", "foodId, foodName, mealTypeId", "Stores food items linked to meal type"),
    @("Meal", "employeeId, mealTypeId, mealDate, foodIds", "Stores meal entries")
  )
  Add-Heading $doc "4.3 Module Description" 2
  Add-Para $doc "Registration Module: Handles new account creation using email, full name, and password. It validates required fields and calls the registration API."
  Add-Para $doc "Login Module: Authenticates users, stores token and employee information, and redirects the user based on role."
  Add-Para $doc "Forgot Password Module: Sends reset OTP to the registered email and allows the user to set a new password."
  Add-Para $doc "Employee Dashboard Module: Displays welcome message, today's plates, meal type selection, food item grid, add meal action, history navigation, and logout."
  Add-Para $doc "Admin Dashboard Module: Displays employee count, today's plates, total revenue, employee search, employee add/update/delete, and navigation to management pages."
  Add-Para $doc "Food Manager Module: Allows the administrator to maintain food items associated with meal types."
  Add-Para $doc "Meal Type Manager Module: Allows the administrator to maintain meal categories and prices."
  Add-Para $doc "History Module: Allows administrators to filter and delete meal records."
  Add-Para $doc "My History Module: Allows employees to view personal meal records and total amount."
  Add-Heading $doc "4.4 Flowcharts" 2
  Add-Para $doc "Figure 4.2: Meal Entry Flowchart"
  Add-Bullets $doc @(
    "User logs in successfully.",
    "System checks role and opens employee dashboard.",
    "Employee selects meal type.",
    "System loads foods for selected meal.",
    "Employee selects one or more food items.",
    "System validates selection.",
    "Meal entry is submitted to API.",
    "System displays success message and refreshes today's plate count."
  )
  Add-Heading $doc "4.5 UML Diagrams" 2
  Add-Para $doc "The important UML diagrams for this project include use case diagram, activity diagram, sequence diagram, and class/entity diagram. These diagrams describe the interaction between users, frontend pages, API services, and data entities."
  Add-Heading $doc "4.6 Algorithm / Model Description" 2
  Add-Para $doc "The system uses a simple role-based navigation algorithm. After login, the returned employee object is stored in localStorage. If the role is Admin, the user is navigated to the admin dashboard; otherwise, the user is navigated to the employee dashboard. For meal entry, the selected meal type controls the list of available foods. The selected food IDs are sent with employeeId and mealTypeId to create a meal entry."

  Page-Break $doc
  Add-Heading $doc "Chapter 5" 1
  Add-Heading $doc "IMPLEMENTATION" 1
  Add-Heading $doc "5.1 Technologies Used" 2
  Add-Bullets $doc @(
    "React.js for frontend component development.",
    "React Router DOM for route-based navigation.",
    "React Toastify for success, warning, and error messages.",
    "React Datepicker for date range filtering in history.",
    "Fetch API for HTTP communication with backend services.",
    "CSS for responsive dark themed dashboard layout.",
    "Azure hosted API for backend endpoints."
  )
  Add-Heading $doc "5.2 Frontend Implementation" 2
  Add-Para $doc "The frontend is organized inside the src folder. App.js defines all routes including registration, login, forgot password, employee dashboard, admin dashboard, history, food manager, meal type manager, and my history. Each page uses React hooks such as useState and useEffect for state handling and lifecycle-based API loading."
  Add-Heading $doc "5.3 Backend Implementation" 2
  Add-Para $doc "The backend is accessed through REST APIs hosted at https://meetali-api-001.azurewebsites.net. The frontend calls endpoints for authentication, employee management, meal type management, food management, meal entry, meal history, today's total plates, and today's total amount."
  Add-Heading $doc "5.4 Database Connectivity" 2
  Add-Para $doc "Database connectivity is handled by the backend API. The React frontend does not access the database directly. It sends JSON requests to API endpoints and receives structured JSON responses. This separation improves maintainability and keeps database operations on the server side."
  Add-Heading $doc "5.5 Code Snippets" 2
  Add-Para $doc "Role-based routing after login:"
  Add-Code $doc "localStorage.setItem('token', data.token);`nlocalStorage.setItem('employee', JSON.stringify(data.employee));`nif (data.employee.role === 'Admin') {`n  navigate('/admindashboard');`n} else {`n  navigate('/dashboard');`n}"
  Add-Para $doc "Meal submission request:"
  Add-Code $doc "await fetch(`${API}/api/Meal/AddBulk`, {`n  method: 'POST',`n  headers: { 'Content-Type': 'application/json' },`n  body: JSON.stringify({`n    employeeId: user.employeeId,`n    mealTypeId: Number(selectedMeal),`n    foodIds: selectedFoods`n  })`n});"
  Add-Heading $doc "5.6 Screenshots of System" 2
  Add-Para $doc "Figure 5.1: Registration Page"
  Add-Para $doc "Figure 5.2: Login Page"
  Add-Para $doc "Figure 5.3: Forgot Password Page"
  Add-Para $doc "Figure 5.4: Employee Dashboard"
  Add-Para $doc "Figure 5.5: Admin Dashboard"
  Add-Para $doc "Figure 5.6: Food Manager"
  Add-Para $doc "Figure 5.7: Meal Type Manager"
  Add-Para $doc "Figure 5.8: Meal History"
  Add-Para $doc "Figure 5.9: My Meal History"

  Page-Break $doc
  Add-Heading $doc "Chapter 6" 1
  Add-Heading $doc "TESTING AND RESULTS" 1
  Add-Heading $doc "6.1 Testing Techniques" 2
  Add-Para $doc "Testing was performed manually through the browser and Chrome DevTools. The main focus was on verifying form validation, route navigation, API requests, API responses, table rendering, filter behavior, loading state, and user feedback. Each module was tested with valid and invalid inputs."
  Add-Heading $doc "6.2 Test Cases" 2
  Add-Table $doc @("Test Case", "Input/Action", "Expected Result", "Status") @(
    @("Registration Required Fields", "Submit empty form", "Warning message shown", "Pass"),
    @("User Registration", "Valid email, name, password", "User registered and redirected to login", "Pass"),
    @("Login Validation", "Empty email/password", "Error message shown", "Pass"),
    @("Admin Login", "Admin credentials", "Navigate to admin dashboard", "Pass"),
    @("Employee Login", "Employee credentials", "Navigate to employee dashboard", "Pass"),
    @("Forgot Password", "Email, OTP, new password", "Password reset and login page opened", "Pass"),
    @("Add Meal", "Meal type and food items selected", "Meal added and plate count refreshed", "Pass"),
    @("Food Management", "Add/update/delete food", "Food list updated", "Pass"),
    @("History Filter", "Date/name/meal type filters", "Filtered records displayed", "Pass")
  )
  Add-Heading $doc "6.3 Output Screens" 2
  Add-Para $doc "The output screens include registration, login, forgot password, employee dashboard, admin dashboard, food manager, meal type manager, meal history, and my history pages. The user interface displays dashboard cards, forms, dropdowns, tables, filter controls, and action buttons."
  Add-Heading $doc "6.4 Performance Analysis" 2
  Add-Para $doc "The frontend performance is suitable for the current project scope. API calls are executed only when required, such as page load, meal type selection, form submission, or filter application. Loading feedback is shown during network operations, which improves user experience."
  Add-Heading $doc "6.5 Accuracy / Result Analysis" 2
  Add-Para $doc "The system improves accuracy by taking meal entries directly from employees and calculating totals through backend APIs. Admin history filters make it easier to verify records. Personal history improves transparency for employees because they can check their own meal usage and total amount."
  Add-Heading $doc "6.6 Graphs and Charts" 2
  Add-Para $doc "The current system displays numeric summaries such as today's plates, total employees, and total revenue. Future versions can include charts for daily meal usage, weekly revenue, month-wise consumption, and meal type popularity."

  Page-Break $doc
  Add-Heading $doc "Chapter 7" 1
  Add-Heading $doc "CONCLUSION AND FUTURE SCOPE" 1
  Add-Heading $doc "7.1 Conclusion" 2
  Add-Para $doc "The Meal Management System successfully provides a digital platform for managing employee meal operations. It replaces manual tracking with a structured web interface where employees can add meal entries and administrators can manage master data and history. The project demonstrates practical use of React.js, routing, API integration, state management, form validation, local storage, loading indicators, and toast notifications."
  Add-Para $doc "The system is useful for organizations that need a simple and reliable way to track daily meals, selected foods, plate count, and total amount. By dividing functionality into employee and admin roles, the system improves usability and keeps responsibilities clear."
  Add-Heading $doc "7.2 Achievements" 2
  Add-Bullets $doc @(
    "Implemented a complete React frontend with multiple role-based pages.",
    "Integrated authentication, registration, and forgot password workflows.",
    "Implemented employee meal selection and personal history.",
    "Implemented admin employee, food, meal type, history, and revenue features.",
    "Created a responsive dark themed interface with feedback messages.",
    "Connected all major workflows with live REST APIs."
  )
  Add-Heading $doc "7.3 Limitations" 2
  Add-Bullets $doc @(
    "The frontend depends on backend API availability and internet connectivity.",
    "Protected route handling can be strengthened further.",
    "The current version does not include downloadable reports.",
    "Charts and analytics are not yet implemented.",
    "Automated test coverage is not included in the current frontend."
  )
  Add-Heading $doc "7.4 Future Enhancements" 2
  Add-Bullets $doc @(
    "Add downloadable PDF and Excel reports for meal history.",
    "Add charts for daily, weekly, and monthly consumption.",
    "Add stronger route guards and token expiry handling.",
    "Add role and permission management for multiple admin levels.",
    "Add payment status tracking and monthly billing.",
    "Add automated unit and integration tests.",
    "Add mobile-first enhancements for employee meal entry.",
    "Add dashboard analytics for most selected foods and meal types."
  )

  Page-Break $doc
  Add-Heading $doc "REFERENCES / BIBLIOGRAPHY" 1
  Add-Bullets $doc @(
    "React.js Official Documentation, https://react.dev/",
    "React Router Documentation, https://reactrouter.com/",
    "React Toastify Documentation, https://fkhadra.github.io/react-toastify/",
    "React Datepicker Documentation, https://reactdatepicker.com/",
    "Create React App Documentation, https://create-react-app.dev/",
    "Microsoft Azure App Service Documentation, https://learn.microsoft.com/azure/app-service/",
    "Mozilla Developer Network, JavaScript Fetch API Documentation, https://developer.mozilla.org/"
  )

  Page-Break $doc
  Add-Heading $doc "APPENDIX" 1
  Add-Heading $doc "A. API Endpoint List" 2
  Add-Bullets $doc @(
    "POST /api/Auth/Register",
    "POST /api/Auth/login",
    "POST /api/Auth/SendResetOtp",
    "POST /api/Auth/ResetPassword",
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
    "DELETE /api/Meal/Delete"
  )
  Add-Heading $doc "B. Project File Structure" 2
  Add-Code $doc "src/`n  App.js`n  App.css`n  index.js`n  components/Loader.js`n  pages/Register.js`n  pages/Login.js`n  pages/ForgotPassword.js`n  pages/Dashboard.js`n  pages/AdminDashBoard.js`n  pages/FoodManager.js`n  pages/MealTypeManager.js`n  pages/History.js`n  pages/MyHistory.js"
  Add-Heading $doc "C. Screenshot Placeholders" 2
  Add-Para $doc "Actual screenshots of the running system can be inserted below each figure title in Chapter 5 or Appendix after opening the application in the browser."

  $doc.TablesOfContents.Item(1).Update()
  foreach ($section in $doc.Sections) {
    $section.PageSetup.TopMargin = 72
    $section.PageSetup.BottomMargin = 72
    $section.PageSetup.LeftMargin = 72
    $section.PageSetup.RightMargin = 72
  }

  if (Test-Path -LiteralPath $outputPath) {
    Remove-Item -LiteralPath $outputPath -Force
  }
  $doc.SaveAs([ref]$outputPath, [ref]$wdFormatDocumentDefault)
  $doc.Close($false)
  Write-Output "Created thesis: $outputPath"
} finally {
  $word.Quit()
}
