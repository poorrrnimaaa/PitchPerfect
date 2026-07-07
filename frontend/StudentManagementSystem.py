from functools import reduce

students = []

subjects = ("Math", "Science", "English")


def get_grade(percent):
    if percent >= 90:
        return "A"
    elif percent >= 75:
        return "B"
    elif percent >= 50:
        return "C"
    elif percent >= 33:
        return "D"
    else:
        return "F"


def addStudent():
    global students

    try:
        roll = int(input("Enter Roll Number: "))

        for s in students:
            if s["roll"] == roll:
                print("Roll number already exists, try another one...")
                return

        name = input("Enter Name: ")

        if not name.replace(" ", "").isalpha():
            print("Name only contain letters!")
            return

        city = input("Enter City: ")

        marks = []
        print("Enter marks out of 100")
        for sub in subjects:
            m = float(input(sub + ": "))
            marks.append(m)

        total = sum(marks)
        avg = total / len(marks)
        percentage = (total / (len(marks) * 100)) * 100
        grade = get_grade(percentage)

        new_student = {
            "roll": roll,
            "name": name,
            "city": city,
            "marks": marks,
            "total": total,
            "average": avg,
            "percentage": percentage,
            "grade": grade
        }

        students.append(new_student)
        print("Student added!")

    except ValueError:
        print("Invalid input, please enter numbers where needed.")

    else:
        print("Data saved")

    finally:
        print("Student Added\n")


def display():
    if not students:
        print("No records available")
        return

    for s in students:
        print("--------------------------------")
        print("Roll No :", s["roll"])
        print("Name    :", s["name"])
        print("City    :", s["city"])

        for i in range(len(subjects)):
            print(subjects[i], "Marks:", s["marks"][i])

        print("Total   :", s["total"])
        print("Average :", round(s["average"], 2))
        print("Percent :", round(s["percentage"], 2))
        print("Grade   :", s["grade"])


def search():
    try:
        roll = int(input("Enter Roll Number: "))
    except ValueError:
        print("Invalid Roll Number!!!")
        return

    found = False

    for s in students:
        if s["roll"] == roll:
            print("Roll no.:", s["roll"])
            print("Name :", s["name"])
            print("City :", s["city"])
            print("Grade:", s["grade"])
            found = True
            break

    if not found:
        print("Student not found!!!")


def update():
    try:
        roll = int(input("Enter Roll No.: "))
    except ValueError:
        print("Invalid Roll Number!!!")
        return

    for s in students:
        if s["roll"] == roll:
            new_city = input("Enter New City: ")
            s["city"] = new_city
            print("Student Updated")
            return

    print("Student not found!!!")


def delete():
    try:
        roll = int(input("Enter Roll No.: "))
    except ValueError:
        print("Invalid Roll Number")
        return

    for s in students:
        if s["roll"] == roll:
            students.remove(s)
            print("Student Deleted!!")
            return

    print("Student not found!!!")


def passed():
    pass_students = list(filter(lambda x: x["percentage"] >= 33, students))

    if len(pass_students) == 0:
        print("No Passed Students!!!")
        return

    for s in pass_students:
        print(s["name"], "-", round(s["percentage"], 2), "%")


def sortMarks():
    if len(students) == 0:
        print("No students found.")
        return

    sorted_students = sorted(students, key=lambda x: x["total"], reverse=True)

    rank = 1
    for s in sorted_students:
        print(rank, ".", s["name"], "-", s["total"])
        rank += 1


def average():
    if len(students) == 0:
        print("No students found.")
        return

    percentages = list(map(lambda x: x["percentage"], students))

    avg = sum(percentages) / len(percentages)

    print("Class Average:", round(avg, 2), "%")


def cities():
    city_set = set()

    for s in students:
        city_set.add(s["city"])

    if len(city_set) == 0:
        print("No Cities Found.")
    else:
        print("Unique Cities:", city_set)


def totalMarks():
    if len(students) == 0:
        print("No students found.")
        return

    totals = list(map(lambda x: x["total"], students))

    grandTotal = reduce(lambda a, b: a + b, totals)

    print("Total Marks of Class:", grandTotal)


#menu

while True:
    print("\n------- STUDENT MANAGEMENT SYSTEM ------")
    print("1. Add Student")
    print("2. Display All Students")
    print("3. Search Student")
    print("4. Update Student")
    print("5. Delete Student")
    print("6. Display Passed Students")
    print("7. Sort Students by Total Marks")
    print("8. Show Class Average")
    print("9. Show Unique Cities")
    print("10. Total Marks of Class")
    print("11. Exit")

    ch = input("Enter Your Choice: ")

    if ch == "1":
        addStudent()

    elif ch == "2":
        display()

    elif ch == "3":
        search()

    elif ch == "4":
        update()

    elif ch == "5":
        delete()

    elif ch == "6":
        passed()

    elif ch == "7":
        sortMarks()

    elif ch == "8":
        average()

    elif ch == "9":
        cities()

    elif ch == "10":
        totalMarks()

    elif ch == "11":
        print("Exiting.....")
        break

    else:
        print("Invalid Choice!!! Try Again......")