<?php
declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Class HomePageController
 * @package App\Controller  *
 * @author Yvan Gimard
 */
class HomePageController extends AbstractController
{
    #[Route('/', name: 'blog_list')]
    public function view(): Response
    {
        $hello = 'Hello there';

        return $this->render('homepage.html.twig', [
            'hello' => $hello
        ]);
    }
}
