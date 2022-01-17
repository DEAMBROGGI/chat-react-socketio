const { Builder, By } = require('selenium-webdriver') // llamamos a los metodos de selenium
const assert = require('assert')

const chrome = require('selenium-webdriver/chrome'); //requerimos los metodos de selenium para chrome
const chromedriver = require('chromedriver'); //requerimos los drivers de chrome

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build()); //construimos el path para chrome e inicializamos el servicio

const credenciales = [ //Definimos credenciales para realizar el test
    { id: 1, username: 'test@test.com.ar', password: '1234Test' }, //password correcta
    { id: 2, username: 'test@test.com.ar', password: '1234Tes' }, //password incorrecta
]

function signinTest() { //creamos la para el realizar el test y su objetivo metodos
    describe('Testeo de signin', function () {

        this.timeout(20000) //establecemos los tiempos maximos de ejecucion

        let webDriver = new Builder().forBrowser('chrome').build() //inicializamos una instancia para los drivers 
        webDriver.manage().window().maximize() //establecemos condiciones de pantalla

        //Creamos los puntos de vericicacion y su nombre
        it('Ingreso credenciales incorrectascorrectas - Debe encontrar texto El usuario y/o contraseña incorrectos?', async () => {

            // Establecemos la url a realizar el text y los pasos de verificacion
            await webDriver.get('http://localhost:3000/')
            await webDriver.findElement(By.name('email')).sendKeys(credenciales[0].username) // busca por nombre el elemento email y le pasa las credenciales definidas
            await webDriver.findElement(By.name('password')).sendKeys(credenciales[1].password) // busca por nombre el elemento password y le pasa las credenciales definidas
            await webDriver.sleep(3000) // tiempo de espera
            await webDriver.findElement(By.className('makeStyles-submit-4 ')).click() //Busca por clase el boton a hacer click
            await webDriver.sleep(2000)    // tiempo de espera
            const texto = await webDriver.findElement(By.css('.MuiSnackbar-root > p')).getText() //Busca un elemento por ruta y obtiene su texto
            assert.strictEqual(texto, "El usuario y/o contraseña incorrectos") //Compara si es igual al parametro establecido

        })
        //Define la segunda instancia de verificacion
        it('Ingreso credenciales correctas - Debe encontrar texto Hello Martin?', async () => {

            await webDriver.get('http://localhost:3000/')
            await webDriver.findElement(By.name('email')).sendKeys(credenciales[0].username)
            await webDriver.findElement(By.name('password')).sendKeys(credenciales[0].password)
            await webDriver.sleep(3000)
            await webDriver.findElement(By.className('makeStyles-submit-4 ')).click()
            await webDriver.sleep(3000)
            const texto = await webDriver.findElement(By.css('#root > div > div > header > div > h6')).getText()
            assert.strictEqual(texto, "Hello Martin")
            webDriver.quit()//Cierra 
        })

    })

}

signinTest() //Llama a la funcion a ejecutar

