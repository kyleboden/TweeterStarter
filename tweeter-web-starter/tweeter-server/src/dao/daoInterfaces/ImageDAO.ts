export interface ImageDAO {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
  getImage(fileName: string): Promise<string>;
}
