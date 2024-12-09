@Component({
    selector: 'app-profile',
    template: `
      <ion-card>
        <ion-card-header>
          <ion-card-title>Mi Perfil</ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <!-- Imagen de perfil -->
          <div class="profile-image">
            <img [src]="profileImage || 'assets/default-avatar.png'" alt="Foto de perfil">
            <ion-button (click)="selectImage()">
              <ion-icon name="camera"></ion-icon>
              Cambiar foto
            </ion-button>
          </div>
  
          <!-- Datos del perfil -->
          <ion-list>
            <ion-item>
              <ion-label position="stacked">Nombre</ion-label>
              <ion-input [(ngModel)]="userData.nombre" (ionBlur)="updateProfile()"></ion-input>
            </ion-item>
            
            <ion-item>
              <ion-label position="stacked">Email</ion-label>
              <ion-input [value]="userData.email" readonly></ion-input>
            </ion-item>
  
            <!-- Más campos según necesites -->
          </ion-list>
        </ion-card-content>
      </ion-card>
    `
  })
  export class ProfileComponent implements OnInit {
    userData: any = {};
    profileImage: string | null = null;
  
    constructor(
      private authService: AuthService,
      private apiService: ApiService
    ) {}
  
    async ngOnInit() {
      this.userData = this.authService.getCurrentUser();
      // Cargar la imagen de perfil si existe
      await this.loadProfileImage();
    }
  
    async selectImage() {
      // Implementar lógica para seleccionar y subir imagen
    }
  
    async updateProfile() {
      // Implementar lógica para actualizar datos del perfil
    }
  }