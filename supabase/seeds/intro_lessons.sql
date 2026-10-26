insert into public.lessons(path_id,slug,title_ru,title_en,content_ru,content_en,position,published) values
('front','frontend-first-page','Твоя первая HTML-страница','Your first HTML page',
'HTML описывает структуру страницы: заголовки, абзацы, ссылки и другие элементы. Браузер читает HTML и показывает результат. CSS отвечает за оформление, а JavaScript — за поведение.

Создай файл index.html в редакторе. Вставь этот пример:
<!doctype html>
<html lang="ru">
  <head><meta charset="UTF-8"><title>Мой первый сайт</title></head>
  <body>
    <h1>Привет, WeCode!</h1>
    <p>Это моя первая страница.</p>
  </body>
</html>

Открой файл в браузере. h1 — главный заголовок, p — абзац. У большинства элементов есть открывающий и закрывающий тег.

Попробуй сам: замени заголовок на своё имя и добавь второй абзац о том, какой сайт хочешь создать. Сохрани файл и обнови браузер.

Когда увидишь свои изменения, отметь урок пройденным. Эта отметка сохраняет твой прогресс; автоматической проверки кода в этом уроке нет.',
'HTML describes the structure of a page: headings, paragraphs, links and other elements. A browser reads HTML and displays the result. CSS controls presentation; JavaScript adds behavior.

Create an index.html file in your editor and add this example:
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>My first website</title></head>
  <body>
    <h1>Hello, WeCode!</h1>
    <p>This is my first page.</p>
  </body>
</html>

Open the file in your browser. h1 is the main heading; p is a paragraph. Most elements have opening and closing tags.

Try it: change the heading to your name and add a second paragraph about a website you want to build. Save the file and refresh your browser.

When you see your changes, mark this lesson as complete. This records your progress; this lesson does not automatically grade your code.',
1,true),
('back','python-first-program','Твоя первая программа на Python','Your first Python program',
'Python выполняет инструкции по порядку. Начнём с вывода текста и переменных — имён, которые ссылаются на значения.

Создай файл hello.py и добавь:
name = "WeCode"
print("Привет,", name)

В терминале открой папку с файлом и запусти:
python3 hello.py

Для запуска нужен установленный Python 3. print() выводит значения на экран. Текст в кавычках — строка. Знак = связывает имя переменной со значением.

Попробуй сам: замени WeCode на своё имя, добавь переменную goal со своей целью и выведи её отдельным вызовом print(). Сохрани файл и запусти программу ещё раз.

Когда программа выведет имя и цель, отметь урок пройденным. Прогресс сохранится в аккаунте; код в этом уроке запускается на твоём компьютере и не проверяется автоматически.',
'Python runs instructions in order. Start with printing text and variables: names that refer to values.

Create a hello.py file and add:
name = "WeCode"
print("Hello,", name)

Open the file folder in your terminal and run:
python3 hello.py

You need Python 3 installed. print() displays values. Text inside quotes is a string. The = sign binds a variable name to a value.

Try it: replace WeCode with your name, add a goal variable describing what you want to build, and print it on a separate line. Save the file and run the program again.

When the program displays your name and goal, mark the lesson as complete. Your progress is saved to your account; code in this lesson runs on your computer and is not automatically graded.',
1,true)
on conflict(slug) do nothing;